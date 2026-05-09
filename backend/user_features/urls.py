from django.urls import path

from .views import WishlistDestroyView, WishlistListCreateView

urlpatterns = [
    path("wishlist/", WishlistListCreateView.as_view()),
    path("wishlist/<int:pk>/", WishlistDestroyView.as_view()),
]
