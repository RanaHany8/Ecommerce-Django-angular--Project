from django.urls import path

from .views import CartHealthView

urlpatterns = [
    path("health/", CartHealthView.as_view(), name="cart-health"),
]
