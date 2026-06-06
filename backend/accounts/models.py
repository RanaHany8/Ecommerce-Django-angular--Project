from django.contrib.auth.models import User
from django.db import models

from django.db.models.signals import post_save
from django.dispatch import receiver


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username


class Seller(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    store_name = models.CharField(max_length=100)

    phone = models.CharField(max_length=20)

    address = models.TextField()

    is_approved = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.store_name


class Wallet(models.Model):

    seller = models.OneToOneField(
        Seller, on_delete=models.CASCADE, related_name="wallet"
    )

    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.seller.store_name} Wallet"


class Payout(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    seller = models.ForeignKey(Seller, on_delete=models.CASCADE, related_name="payouts")

    amount = models.DecimalField(max_digits=12, decimal_places=2)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.seller.store_name} - {self.amount}"


class Payment(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("failed", "Failed"),
    ]

    seller = models.ForeignKey(
        Seller, on_delete=models.CASCADE, related_name="payments"
    )

    amount = models.DecimalField(max_digits=12, decimal_places=2)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    payment_method = models.CharField(max_length=50, default="cash_on_delivery")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.seller.store_name} - {self.amount}"


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
