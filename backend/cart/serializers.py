from rest_framework import serializers
from .models import Cart, CartItem  
from catalog.models import Product

class ProductSimpleSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    title = serializers.CharField(source='name', read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'title', 'price', 'image', 'stock']

    def get_image(self, obj):
        primary = obj.images.filter(is_primary=True).first() or obj.images.first()
        if primary and primary.image_url:
            return primary.image_url
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSimpleSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), 
        source='product', 
        write_only=True
    )
    product_title = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)
    subtotal = serializers.ReadOnlyField() 

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'product_title', 'product_price', 'quantity', 'subtotal']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_cart_price = serializers.ReadOnlyField() 

    class Meta:
        model = Cart
        fields = ['id', 'user', 'session_id', 'items', 'total_cart_price'] 
        read_only_fields = ['user', 'session_id']