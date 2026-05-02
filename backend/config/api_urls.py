from django.urls import include, path
from rest_framework.response import Response
from rest_framework.views import APIView


class ApiHealthView(APIView):
    def get(self, request):
        return Response({"service": "backend", "status": "ok", "version": "v1"})


urlpatterns = [
    path("health/", ApiHealthView.as_view(), name="api-health"),
    path("accounts/", include("accounts.urls")),
    path("products/", include("products.urls")),
    path("cart/", include("cart.urls")),
    path("orders/", include("orders.urls")),
]
