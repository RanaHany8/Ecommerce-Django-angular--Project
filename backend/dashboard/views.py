from django.db.models import Sum, Count
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from catalog.models import Product, Category
from .models import PromoCode, HomeBanner
from .serializers import PromoCodeSerializer, HomeBannerSerializer, AdminUserSerializer
from .permissions import IsSuperAdmin


try:
    from orders.models import Order
    ORDER_MODEL_READY = True
except ImportError:
    ORDER_MODEL_READY = False

class AdminDashboardStatsView(APIView):
    permission_classes = [IsSuperAdmin]
    def get(self, request):
      
        if ORDER_MODEL_READY:
            sales = Order.objects.aggregate(total=Sum('total_amount'))['total'] or 0
            order_count = Order.objects.count()
            pending_orders = Order.objects.filter(status='pending').count()
        else:
            sales = 0
            order_count = 0
            pending_orders = 0
        
        data = {
            "overview": {
                "products_count": Product.objects.count(),
                "users_count": User.objects.count(),
                "total_revenue": sales,
                "total_orders": order_count
            },
            "orders_status": {
                "pending": pending_orders,
                "model_status": "Ready" if ORDER_MODEL_READY else "Waiting for Person 3"
            }
        }
        return Response(data)

class UserManagementView(APIView):
    permission_classes = [IsSuperAdmin]
    def get(self, request):
        users = User.objects.all()
        serializer = AdminUserSerializer(users, many=True)
        return Response(serializer.data)

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            user.is_active = not user.is_active
            user.save()
            return Response({"status": "updated", "is_active": user.is_active})
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class AdminProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdmin]
    queryset = Product.objects.all()
    from catalog.serializers import ProductListSerializer
    serializer_class = ProductListSerializer

class PromoCodeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdmin]
    queryset = PromoCode.objects.all()
    serializer_class = PromoCodeSerializer

class HomeBannerViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdmin]
    queryset = HomeBanner.objects.all()
    serializer_class = HomeBannerSerializer



class AdminOrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdmin]
    if ORDER_MODEL_READY:
        queryset = Order.objects.all()
        from orders.serializers import OrderSerializer
        serializer_class = OrderSerializer
    else:
        queryset = Product.objects.none() 
        serializer_class = PromoCodeSerializer