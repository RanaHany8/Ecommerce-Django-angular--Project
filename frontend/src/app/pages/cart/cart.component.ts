import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartData: any = null; 
  isLoading: boolean = true;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cartData = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching cart:', err);
        this.isLoading = false;
      }
    });
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
    if (confirm('Are you sure you want to remove this item?')) {
      this.cartService.removeFromCart(itemId).subscribe({
        next: () => {
          this.loadCart();
        },
        error: (err) => console.error('Error removing item:', err)
      });
    }
  }
}