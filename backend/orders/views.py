from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Order, OrderItem, Coupon
from .serializers import OrderSerializer
from cart.models import Cart

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer

    def get_queryset(self):
        """show only the orders of the currently authenticated user"""
        if not self.request.user.is_authenticated:
            return Order.objects.none()
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def create(self, request):
        """create a new order based on the current user's cart and the provided order details"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        if request.user.is_authenticated:
            cart = Cart.objects.filter(user=request.user).first()
        else:
            session_id = request.session.session_key
            cart = Cart.objects.filter(session_id=session_id).first()

        if not cart or not cart.items.exists():
            return Response({"error": "Your cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        total_price = sum(item.product.price * item.quantity for item in cart.items.all())

        coupon_code = serializer.validated_data.pop('coupon_code', None)
        coupon = None

        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code, active=True)
                if not (coupon.start_valid_from <= timezone.now() <= coupon.end_valid_to):
                    return Response({"error": "Coupon is not currently valid"}, status=status.HTTP_400_BAD_REQUEST)
                
                total_price = total_price * (1 - coupon.discount_percent / 100)
            except Coupon.DoesNotExist:
                return Response({"error": "Invalid coupon code"}, status=status.HTTP_400_BAD_REQUEST)

        order = serializer.save(
            user=request.user if request.user.is_authenticated else None, 
            coupon=coupon,
            total_price=total_price 
        )

        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                price=item.product.price,
                quantity=item.quantity
            )
            item.product.stock -= item.quantity
            item.product.save()

        cart.items.all().delete()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)