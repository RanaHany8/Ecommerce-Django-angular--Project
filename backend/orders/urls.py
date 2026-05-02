from django.urls import path

from .views import OrdersHealthView

urlpatterns = [
    path("health/", OrdersHealthView.as_view(), name="orders-health"),
]
