from rest_framework.response import Response
from rest_framework.views import APIView


class CartHealthView(APIView):
    def get(self, request):
        return Response({"service": "cart", "status": "ok"})
