from rest_framework import generics, permissions
from django.contrib.auth.models import User

from .models import Profile

from rest_framework import generics
from django.contrib.auth.models import User

from .models import Profile
from .serializers import RegisterSerializer, ProfileSerializer
from rest_framework.generics import RetrieveUpdateAPIView


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
    
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile
    



class ProfileUpdateView(RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile