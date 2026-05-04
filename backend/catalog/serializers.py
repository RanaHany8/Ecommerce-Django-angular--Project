from rest_framework import serializers
from .models import Category, Product, ProductImage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'is_primary']

class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'price',
            'stock',
            'is_active',
            'featured',
            'category',
            'primary_image',
        ]

    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        
        if not primary:
            primary = obj.images.first()
            
        if primary and primary.image_url:
            return primary.image_url
            
        return None

class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'price',
            'stock',
            'is_active',
            'featured',
            'image',
            'category',
            'images',
            'created_at',
        ]

    def get_image(self, obj):
        primary = obj.images.filter(is_primary=True).first() or obj.images.first()
        return primary.image_url if primary else None