from rest_framework import serializers
from .models import Order, OrderItem, Coupon
from cart.serializers import ProductSimpleSerializer 

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ['code', 'discount_percent', 'active', 'start_valid_from', 'end_valid_to']

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSimpleSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'price', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    coupon_code = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'full_name', 'email', 'phone', 'address', 
            'total_price', 'coupon', 'coupon_code', 'status', 'items', 'created_at'
        ]
        read_only_fields = ['user', 'total_price', 'coupon', 'status']