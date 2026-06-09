import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartData: any = null;
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  
  shippingDetails = {
    full_name: '',
    email: '',
    phone: '',
    address: ''
  };

  couponCode: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCartSummary();
  }

  loadCartSummary(): void {
    this.cartService.getCart().subscribe({
      next: (data: any) => {
        this.cartData = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading cart summary:', err);
        this.isLoading = false;
      }
    });
  }

  placeOrder(): void {
    if (!this.shippingDetails.full_name || !this.shippingDetails.email || !this.shippingDetails.phone || !this.shippingDetails.address) {
      this.errorMessage = 'Please fill in all shipping fields.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload = {
      ...this.shippingDetails,
      coupon_code: this.couponCode
    };

    this.orderService.createOrder(payload).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        alert('Order placed successfully!');
        this.router.navigate(['/orders']); 
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.error || 'Something went wrong while placing your order.';
      }
    });
  }
}