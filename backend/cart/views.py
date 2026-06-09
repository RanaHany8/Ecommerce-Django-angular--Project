from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Cart, CartItem
from catalog.models import Product 
from .serializers import CartSerializer


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer

    pagination_class = None

   
    def _get_or_create_session(self, request):
        session_id = request.query_params.get('session_id')
        
        if session_id and session_id != 'null' and session_id != 'undefined':
            return session_id
            
        if not request.session.session_key:
            request.session.create()
        
        return request.session.session_key

    def get_queryset(self):
        try:
            if self.request.user.is_authenticated:
                cart, created = Cart.objects.get_or_create(user=self.request.user)
            else:
                session_id = self._get_or_create_session(self.request)

                if not session_id:
                    self.request.session.create()
                    session_id = self.request.session.session_key

                cart, created = Cart.objects.get_or_create(session_id=session_id)

            return Cart.objects.filter(id=cart.id)

        except Exception as e:
            print(f"!!! CRITICAL ERROR IN GET_QUERYSET: {e} !!!")
            return Cart.objects.none()

   
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        cart = queryset.first()

        if not cart:
            return Response([])

        serializer = self.get_serializer(cart)
        return Response([serializer.data])

   
    @action(detail=False, methods=['post'], url_path='add-item')
    def add_item(self, request):
        if request.user.is_authenticated:
            current_cart, _ = Cart.objects.get_or_create(user=request.user)
        else:
            session_id = request.data.get('session_id')

            if not session_id or session_id in ['null', 'undefined']:
                session_id = self._get_or_create_session(request)

            current_cart, _ = Cart.objects.get_or_create(session_id=session_id)

        print(f"=== [DEBUG ADD ITEM FIXED] ===")
        print(f"Cart ID: {current_cart.id} | Session ID: {current_cart.session_id}")

        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        if not product_id:
            return Response({"error": "Product ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        cart_item, created = CartItem.objects.get_or_create(
            cart=current_cart,
            product=product
        )

        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity

        cart_item.save()

        print(f"Items now: {current_cart.items.count()}")

        return Response(
            {"message": "Product added to cart successfully!"},
            status=status.HTTP_201_CREATED
        )

    
    @action(detail=True, methods=['put'], url_path='update-quantity')
    def update_quantity(self, request, pk=None):
        current_cart = self.get_queryset().first()

        if not current_cart:
            return Response({"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            cart_item = CartItem.objects.get(id=int(pk), cart=current_cart)
        except (CartItem.DoesNotExist, ValueError):
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

        cart_item.quantity = int(request.data.get('quantity', 1))
        cart_item.save()

        request.session.modified = True

        return Response({"message": "Quantity updated successfully"}, status=status.HTTP_200_OK)

   
    @action(detail=True, methods=['delete'], url_path='remove-item')
    def remove_item(self, request, pk=None):
        current_cart = self.get_queryset().first()

        if not current_cart:
            return Response({"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            cart_item = CartItem.objects.get(id=int(pk), cart=current_cart)
            cart_item.delete()
            request.session.modified = True

            return Response({"message": "Item removed from cart"}, status=status.HTTP_200_OK)

        except (CartItem.DoesNotExist, ValueError):
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)