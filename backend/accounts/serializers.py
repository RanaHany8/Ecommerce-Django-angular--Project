from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Profile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ['id', 'phone', 'address'] 

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['username'] = instance.user.username
        data['email'] = instance.user.email

        return data


    def validate(self, data):
        user = self.instance.user if self.instance else None

        username = self.initial_data.get('username')
        email = self.initial_data.get('email')

        if username:
            if User.objects.exclude(id=user.id).filter(username=username).exists():
                raise serializers.ValidationError({
                    "username": "Username already exists"
                })

        if email:
            if User.objects.exclude(id=user.id).filter(email=email).exists():
                raise serializers.ValidationError({
                    "email": "Email already exists"
                })

        return data


    def update(self, instance, validated_data):
        user = instance.user

        username = self.initial_data.get('username')
        email = self.initial_data.get('email')

        if username:
            user.username = username

        if email:
            user.email = email

        user.save()

        instance.phone = validated_data.get('phone', instance.phone)
        instance.address = validated_data.get('address', instance.address)
        instance.save()

        return instance