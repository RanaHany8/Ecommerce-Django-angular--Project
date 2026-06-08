from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from products.models import Product
# add, update, delete items in cart (CRUD )
class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer

    def get_queryset(self):
        if self.request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=self.request.user)
            return Cart.objects.filter(id=cart.id)
        else:
            session_id = self.request.session.session_key
            if not session_id:
                self.request.session.create()
                session_id = self.request.session.session_key
            cart, created = Cart.objects.get_or_create(session_id=session_id)
            return Cart.objects.filter(id=cart.id)

    
    @action(detail=False, methods=['post'], url_path='add-item')
    
    def add_item(self, request):
        cart = self.get_queryset().first()
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        if product.stock < quantity:
            return Response({"error": f"Only {product.stock} items left in stock"}, status=status.HTTP_400_BAD_REQUEST)

        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            if product.stock < (cart_item.quantity + quantity):
                return Response({"error": "Cannot add more of this item, stock limit reached"}, status=status.HTTP_400_BAD_REQUEST)
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
            
        cart_item.save()
        return Response({"message": "Item added to cart successfully"}, status=status.HTTP_200_OK)

    
    @action(detail=False, methods=['put'], url_path='update-quantity/(?P<item_id>[0-9]+)')

    def update_quantity(self, request, item_id=None):
        try:
            cart_item = CartItem.objects.get(id=item_id, cart=self.get_queryset().first())
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found in cart"}, status=status.HTTP_404_NOT_FOUND)

        new_quantity = int(request.data.get('quantity', 1))
        
        if cart_item.product.stock < new_quantity:
            return Response({"error": "Not enough stock available"}, status=status.HTTP_400_BAD_REQUEST)

        cart_item.quantity = new_quantity
        cart_item.save()
        return Response({"message": "Quantity updated successfully"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'], url_path='remove-item/(?P<item_id>[0-9]+)')
    def remove_item(self, request, item_id=None):
        try:
            cart_item = CartItem.objects.get(id=item_id, cart=self.get_queryset().first())
            cart_item.delete()
            return Response({"message": "Item removed from cart"}, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found in cart"}, status=status.HTTP_404_NOT_FOUND)