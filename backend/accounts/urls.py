from django.urls import path
from .views import LoginView, ProfileView,BecomeSellerView, RegisterView, activate_account,SellerProfileView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("profile/", ProfileView.as_view()),
    path("become-seller/", BecomeSellerView.as_view()),
    path("seller-profile/", SellerProfileView.as_view()),
    path("activate/<uidb64>/<token>/", activate_account),

]