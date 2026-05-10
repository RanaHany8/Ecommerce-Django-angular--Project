from django.urls import path

from .views import (
    ReviewDetailView,
    ReviewListCreateView,
    WishlistDestroyView,
    WishlistListCreateView,
)

urlpatterns = [
    path("wishlist/", WishlistListCreateView.as_view()),
    path("wishlist/<int:pk>/", WishlistDestroyView.as_view()),
    path("reviews/", ReviewListCreateView.as_view()),
    path("reviews/<int:pk>/", ReviewDetailView.as_view()),
]
