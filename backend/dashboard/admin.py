from django.contrib import admin
from .models import PromoCode, HomeBanner

@admin.register(PromoCode)
class PromoCodeAdmin(admin.ModelAdmin):
    list_display = ['code', 'discount_percentage', 'is_active', 'valid_to']
    list_filter = ['is_active']
    search_fields = ['code']

@admin.register(HomeBanner)
class HomeBannerAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active', 'created_at']