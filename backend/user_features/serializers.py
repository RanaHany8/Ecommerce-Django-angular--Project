from rest_framework import serializers

from catalog.models import Product
from catalog.serializers import ProductListSerializer
from .models import Wishlist


class WishlistSerializer(serializers.ModelSerializer):
    """List/read: nested product. Create: send only product_id (user comes from JWT)."""

    product = ProductListSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(is_active=True),
        source="product",
        write_only=True,
    )

    class Meta:
        model = Wishlist
        fields = ["id", "product", "product_id"]
        read_only_fields = ["id", "product"]
