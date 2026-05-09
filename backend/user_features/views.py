from rest_framework import generics, permissions, status
from rest_framework.response import Response

from .models import Wishlist
from .serializers import WishlistSerializer


class WishlistListCreateView(generics.ListCreateAPIView):

    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            Wishlist.objects.filter(user=self.request.user)
            .select_related("product__category")
            .prefetch_related("product__images")
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.validated_data["product"]
        wishlist, created = Wishlist.objects.get_or_create(
            user=request.user,
            product=product,
        )
        output = WishlistSerializer(wishlist, context=self.get_serializer_context())
        return Response(
            output.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class WishlistDestroyView(generics.DestroyAPIView):

    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)
