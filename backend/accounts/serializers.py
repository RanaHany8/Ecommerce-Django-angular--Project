from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import Profile, Seller, Wallet
from catalog.models import Product


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=User.objects.all(), message="Username already exists"
            )
        ]
    )
    email = serializers.EmailField(
        validators=[
            UniqueValidator(queryset=User.objects.all(), message="Email already exists")
        ]
    )
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ["id", "phone", "address"]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data["username"] = instance.user.username
        data["email"] = instance.user.email

        return data

    def validate(self, data):
        user = self.instance.user if self.instance else None

        username = self.initial_data.get("username")
        email = self.initial_data.get("email")

        if username:
            if User.objects.exclude(id=user.id).filter(username=username).exists():
                raise serializers.ValidationError(
                    {"username": "Username already exists"}
                )

        if email:
            if User.objects.exclude(id=user.id).filter(email=email).exists():
                raise serializers.ValidationError({"email": "Email already exists"})

        return data

    def update(self, instance, validated_data):
        user = instance.user

        username = self.initial_data.get("username")
        email = self.initial_data.get("email")

        if username:
            user.username = username

        if email:
            user.email = email

        user.save()

        instance.phone = validated_data.get("phone", instance.phone)
        instance.address = validated_data.get("address", instance.address)
        instance.save()

        return instance


class SellerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Seller
        fields = ["id", "store_name", "phone", "address", "is_approved"]


class BecomeSellerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Seller
        fields = ["store_name", "phone", "address"]


class SellerDashboardSerializer(serializers.Serializer):

    store_name = serializers.CharField()

    products_count = serializers.IntegerField()

    total_stock = serializers.IntegerField()

    out_of_stock_products = serializers.IntegerField()

class WalletSerializer(serializers.ModelSerializer):

    class Meta:
        model = Wallet
        fields = [
            'id',
            'balance',
            'created_at'
        ]
