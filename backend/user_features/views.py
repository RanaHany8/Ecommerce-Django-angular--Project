from rest_framework import generics, permissions, status
from rest_framework.response import Response

from .models import Review, Wishlist
from .serializers import ReviewSerializer, WishlistSerializer


class WishlistListCreateView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

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


class ReviewListCreateView(generics.ListCreateAPIView):
    """GET ?product=<id> — list reviews. POST — add review (JWT)."""

    serializer_class = ReviewSerializer
    pagination_class = None

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        qs = Review.objects.select_related("user", "product").order_by("-created_at")
        product_id = self.request.query_params.get("product")
        if product_id:
            qs = qs.filter(product_id=product_id)
        return qs

    def list(self, request, *args, **kwargs):
        if not request.query_params.get("product"):
            return Response(
                {"detail": 'Query parameter "product" is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET — public. PUT/PATCH/DELETE — owner only (JWT)."""

    serializer_class = ReviewSerializer
    pagination_class = None

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        qs = Review.objects.select_related("user", "product")
        if self.request.method in ("PUT", "PATCH", "DELETE"):
            return qs.filter(user=self.request.user)
        return qs
