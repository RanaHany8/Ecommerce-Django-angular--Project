from django.urls import path
from .views import RegisterView, ProfileView, ProfileUpdateView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('profile/update/', ProfileUpdateView.as_view()),
]