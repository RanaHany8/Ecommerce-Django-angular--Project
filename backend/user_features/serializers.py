from rest_framework import serializers

from catalog.models import Product
from catalog.serializers import ProductListSerializer
from .models import Review, Wishlist


class WishlistSerializer(serializers.ModelSerializer):
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


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Review
        fields = ["id", "username", "product", "rating", "comment", "created_at"]
        read_only_fields = ["id", "username", "created_at"]
        extra_kwargs = {
            "product": {"required": False},
            "comment": {"allow_blank": True},
        }

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def validate(self, attrs):
        request = self.context.get("request")
        if request and self.instance is None:
            product = attrs.get("product")
            if product is None:
                raise serializers.ValidationError(
                    {"product": "This field is required."}
                )
            if Review.objects.filter(user=request.user, product=product).exists():
                raise serializers.ValidationError(
                    {"detail": "You have already reviewed this product."}
                )
        return attrs

    def update(self, instance, validated_data):
        validated_data.pop("product", None)
        return super().update(instance, validated_data)
