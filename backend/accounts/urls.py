from django.urls import path
from .views import (
    LoginView,
    ProfileView,
    BecomeSellerView,
    RegisterView,
    activate_account,
    SellerDashboardView,
    SellerProfileView,
    WalletView,
    SellerEarningsView,
    PayoutListCreateView,
    PaymentListCreateView,
)

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("profile/", ProfileView.as_view()),
    path("become-seller/", BecomeSellerView.as_view()),
    path("seller-profile/", SellerProfileView.as_view()),
    path("seller-dashboard/", SellerDashboardView.as_view()),
    path("wallet/", WalletView.as_view()),
    path("earnings/", SellerEarningsView.as_view()),
    path("payouts/", PayoutListCreateView.as_view()),
    path("payments/", PaymentListCreateView.as_view()),
    path("activate/<uidb64>/<token>/", activate_account),
]
