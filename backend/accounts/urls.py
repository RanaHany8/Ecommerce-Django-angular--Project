from django.urls import path

from .views import AccountsHealthView

urlpatterns = [
    path("health/", AccountsHealthView.as_view(), name="accounts-health"),
]
