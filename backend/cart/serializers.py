from rest_framework import serializers
from .models import Cart, CartItem  
from products.models import Product

class ProductSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'image', 'stock']

class CartItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='product.title', read_only=True)
    product_price = serializers.DecimalField(source='product.price', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_title', 'product_price', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'session_id', 'items'] 
        read_only_fields = ['user', 'session_id']

    def get_items(self, obj):
        cart_items = CartItem.objects.filter(cart=obj)
        return CartItemSerializer(cart_items, many=True).data