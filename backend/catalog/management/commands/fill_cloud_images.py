import cloudinary.uploader
import re
import time
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from catalog.models import Product

class Command(BaseCommand):
    help = 'Upload precise and high-quality product images to Cloudinary'

    def add_arguments(self, parser):
        parser.add_argument('--limit', type=int, default=100, help='How many products to process')

    def handle(self, *args, **options):
        limit = options['limit']
        products = Product.objects.order_by('id')[:limit]

        if not products:
            self.stdout.write(self.style.WARNING('No products found.'))
            return

        updated = 0
        failed = 0

        for index, product in enumerate(products, start=1):
            raw_name = product.name.split('-')[0].split('(')[0] 
            clean_name = re.sub(r'[^a-zA-Z\s]', '', raw_name).strip()
            
            search_keywords = "+".join(clean_name.split()[:3])

            
            image_sources = [
                f'https://loremflickr.com/800/800/{search_keywords},product/all',
                f'https://picsum.photos/seed/{product.id}/800/800'
            ]

            try:
                upload_result = None
                for source_url in image_sources:
                    try:
                        upload_result = cloudinary.uploader.upload(
                            source_url,
                            public_id=f"shopsphere/products/item_{product.id}",
                            overwrite=True,
                            resource_type='image',
                            format='jpg',
                            tags=[product.category.name, "verified_product"]
                        )
                        if upload_result:
                            break 
                    except Exception:
                        continue 

                if not upload_result:
                    raise Exception("All image providers are down")

                product.image = upload_result.get('secure_url')
                product.save(update_fields=['image'])
                
                updated += 1
                self.stdout.write(
                    self.style.SUCCESS(f'✅ [{index}/{len(products)}] Done: {product.name}')
                )
                
                time.sleep(0.8)

            except Exception as exc:
                failed += 1
                self.stdout.write(self.style.WARNING(f'❌ [{index}/{len(products)}] Failed: {product.name}'))

        self.stdout.write(
            self.style.SUCCESS(f'\n🚀 Finished! Updated: {updated}, Failed: {failed}')
        )