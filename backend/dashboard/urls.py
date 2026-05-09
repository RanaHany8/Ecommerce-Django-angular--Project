from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdminProductViewSet, 
    UserManagementView, 
    AdminDashboardStatsView,
    PromoCodeViewSet,
   HomeBannerViewSet,
    AdminOrderViewSet
)

router = DefaultRouter()
router.register(r'products', AdminProductViewSet, basename='admin-products')
router.register(r'promocodes', PromoCodeViewSet, basename='admin-promocodes')
router.register(r'banners', HomeBannerViewSet, basename='admin-banners')

try:
    from orders.models import Order
    router.register(r'orders-management', AdminOrderViewSet, basename='admin-orders')
except ImportError:
    pass

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', AdminDashboardStatsView.as_view(), name='admin-stats'),
    path('users/', UserManagementView.as_view(), name='admin-users'),
    path('users/<int:pk>/', UserManagementView.as_view(), name='admin-user-detail'),
]