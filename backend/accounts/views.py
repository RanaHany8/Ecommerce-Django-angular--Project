from django.contrib.auth import authenticate, get_user_model
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view

from .serializers import ProfileSerializer, RegisterSerializer,SellerSerializer,BecomeSellerSerializer
from django.core.mail import EmailMultiAlternatives
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from .tokens import account_activation_token
from .emails import activation_email_html, activation_email_plain
from .models import Seller
User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        user.is_active = False
        user.save()

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = account_activation_token.make_token(user)

        activation_link = f"http://localhost:4200/activate/{uid}/{token}"

        subject = "Activate your ShopSphere account"
        msg = EmailMultiAlternatives(
            subject=subject,
            body=activation_email_plain(activation_link),
            from_email="shazahamdy011@gmail.com",
            to=[user.email],
        )
        msg.attach_alternative(
            activation_email_html(activation_link, user.username),
            "text/html",
        )
        msg.send()

        return Response({"message": "Check your email to activate your account"})


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip()
        password = request.data.get("password", "")

        user = User.objects.filter(email__iexact=email).first()

        if not user:
            return Response({"detail": "User not found."}, status=404)

        authenticated_user = authenticate(
            request,
            username=user.username,
            password=password
        )

        if not authenticated_user:
            return Response({"detail": "Invalid credentials."}, status=401)

        refresh = RefreshToken.for_user(authenticated_user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id": authenticated_user.id,
                "username": authenticated_user.username,
                "email": authenticated_user.email,
            },
        })


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile


class BecomeSellerView(generics.CreateAPIView):
    serializer_class = BecomeSellerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):

        if Seller.objects.filter(user=request.user).exists():
            return Response(
                {"message": "You are already a seller"},
                status=status.HTTP_400_BAD_REQUEST
            )

        seller = Seller.objects.create(
            user=request.user,
            store_name=request.data.get('store_name'),
            phone=request.data.get('phone'),
            address=request.data.get('address')
        )

        serializer = SellerSerializer(seller)

        return Response(serializer.data)

@api_view(['GET'])
def activate_account(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except:
        return Response({"error": "Invalid link"}, status=400)

    if account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        return Response({"message": "Account activated"}, status=200)

    return Response({"error": "Invalid or expired token"}, status=400)


