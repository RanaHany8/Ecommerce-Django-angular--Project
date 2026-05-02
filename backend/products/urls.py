from django.urls import path

from .views import ProductsHealthView

urlpatterns = [
    path("health/", ProductsHealthView.as_view(), name="products-health"),
]
