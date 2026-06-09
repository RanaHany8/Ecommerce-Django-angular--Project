from django.urls import path
from .views import CartViewSet

# فك الروابط يدوياً لضمان ثبات الاستقبال والـ Context بنسبة 100%
cart_list = CartViewSet.as_view({'get': 'list'})
cart_add = CartViewSet.as_view({'post': 'add_item'})
cart_update = CartViewSet.as_view({'put': 'update_quantity'})
cart_remove = CartViewSet.as_view({'delete': 'remove_item'})

urlpatterns = [
    path('', cart_list, name='cart-detail'),
    
    path('add-item/', cart_add, name='cart-add-item'),
    
    path('update-quantity/<int:pk>/', cart_update, name='cart-update-quantity'),
    
    path('remove-item/<int:pk>/', cart_remove, name='cart-remove-item'),
]