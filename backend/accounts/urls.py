from django.urls import path
from .views import LoginView, ProfileView, RegisterView, activate_account

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("profile/", ProfileView.as_view()),
    path("activate/<uidb64>/<token>/", activate_account),
]