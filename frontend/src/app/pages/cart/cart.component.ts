import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  isLoading: boolean = false;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (res: any) => {
        console.log('Cart data:', res);

        let targetCart: any = null;

        if (res && res.results && Array.isArray(res.results)) {
          targetCart = res.results[0];
        } 
        else if (Array.isArray(res)) {
          targetCart = res[0];
        } 
        else {
          targetCart = res;
        }

        if (targetCart && targetCart.items && Array.isArray(targetCart.items)) {
          this.cartItems = targetCart.items;
        } else if (targetCart && Array.isArray(targetCart)) {
          this.cartItems = targetCart;
        } else {
          this.cartItems = [];
        }

        this.cartItems = [...this.cartItems];
        this.calculateTotal();
        this.isLoading = false;
        console.log(' cartItems:', this.cartItems);
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
        this.cartItems = [];
        this.totalPrice = 0;
        this.isLoading = false;
      }
    });
  }

  calculateTotal(): void {
    if (!this.cartItems || this.cartItems.length === 0) {
      this.totalPrice = 0;
      return;
    }

    this.totalPrice = this.cartItems.reduce((acc, item) => {
      const priceSource = item.product?.price || item.price || 0;
      const price = typeof priceSource === 'string' ? parseFloat(priceSource) : priceSource;
      const quantity = item.quantity || 1;
      return acc + (price * quantity);
    }, 0);
  }

  changeQuantity(itemId: number, currentQty: number, count: number): void {
    const newQuantity = currentQty + count;
    if (newQuantity < 1) return; 
    
    this.cartService.updateQuantity(itemId, newQuantity).subscribe({
      next: () => {
        this.loadCart(); 
      },
      error: (err) => console.error('Error updating quantity:', err)
    }); 
  } 

  removeItem(itemId: number): void {
    this.cartService.removeFromCart(itemId).subscribe({
      next: () => {
        this.loadCart(); 
      },
      error: (err) => console.error('Error removing item:', err)
    }); 
  }
}