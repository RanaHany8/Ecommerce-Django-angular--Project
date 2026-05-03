import json
from decimal import Decimal
from pathlib import Path

import cloudinary.uploader
from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils.text import slugify

from catalog.models import Category, Product, ProductImage


class Command(BaseCommand):
    help = 'Seed categories/products from exact_products.json and upload images to Cloudinary'

    def add_arguments(self, parser):
        parser.add_argument(
            '--path',
            type=str,
            default=str(settings.BASE_DIR.parent / 'exact_products.json'),
            help='Path to exact_products.json (default: project root)',
        )

    def handle(self, *args, **options):
        json_path = Path(options['path'])
        if not json_path.exists():
            raise FileNotFoundError(
                f'File not found: {json_path}. Put exact_products.json in project root or pass --path.'
            )

        with json_path.open('r', encoding='utf-8') as f:
            payload = json.load(f)

        # Accept either {"products":[...]} or a raw list [...]
        products_data = payload.get('products') if isinstance(payload, dict) else payload
        if not isinstance(products_data, list):
            raise ValueError('Invalid JSON structure. Expected a list or {"products": [...]}')

        created_products = 0
        updated_products = 0
        created_categories = 0
        uploaded_images = 0

        with transaction.atomic():
            for item in products_data:
                name = (item.get('name') or '').strip()
                if not name:
                    continue

                category_name = (item.get('category') or item.get('category_name') or 'General').strip()
                category_slug = slugify(item.get('category_slug') or category_name)

                category, cat_created = Category.objects.update_or_create(
                    slug=category_slug,
                    defaults={
                        'name': category_name,
                        'description': (item.get('category_description') or '').strip(),
                    },
                )
                if cat_created:
                    created_categories += 1

                product_slug = slugify(item.get('slug') or name)
                price = Decimal(str(item.get('price', '0') or '0'))
                stock = int(item.get('stock', 0) or 0)
                featured = bool(item.get('featured', False))
                is_active = bool(item.get('is_active', True))

                product, prod_created = Product.objects.update_or_create(
                    slug=product_slug,
                    defaults={
                        'category': category,
                        'name': name,
                        'description': (item.get('description') or '').strip(),
                        'price': price,
                        'stock': stock,
                        'featured': featured,
                        'is_active': is_active,
                    },
                )
                if prod_created:
                    created_products += 1
                else:
                    updated_products += 1

                image_url = (item.get('image_url') or item.get('image') or '').strip()
                if not image_url:
                    continue

                public_id = f"shopsphere_json_{product.id}_{slugify(product.name)}"
                upload = cloudinary.uploader.upload(
                    image_url,
                    public_id=public_id,
                    overwrite=True,
                    resource_type='image',
                    format='jpg',
                )
                secure_url = upload.get('secure_url') or upload.get('url')
                if not secure_url:
                    continue

                # Make this the primary image in ProductImage
                ProductImage.objects.filter(product=product, is_primary=True).update(is_primary=False)
                ProductImage.objects.update_or_create(
                    product=product,
                    image_url=secure_url,
                    defaults={'is_primary': True},
                )
                uploaded_images += 1

        self.stdout.write(
            self.style.SUCCESS(
                'Done. '
                f'Categories created: {created_categories}. '
                f'Products created: {created_products}, updated: {updated_products}. '
                f'Images uploaded: {uploaded_images}.'
            )
        )
