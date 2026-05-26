from django.contrib import admin

from .models import Review, Wishlist


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "product")
    list_select_related = ("user", "product")


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "product", "rating", "created_at")
    list_select_related = ("user", "product")
    ordering = ("-created_at",)
