import { CommonModule, CurrencyPipe, DatePipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, NgClass, RouterLink, CurrencyPipe, DatePipe, TitleCasePipe],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  isLoading: boolean = true;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
  }

 loadOrders(): void {
  this.isLoading = true;
  this.orderService.getUserOrders().subscribe({
    next: (data: any) => {
      if (data && data.results && Array.isArray(data.results)) {
        this.orders = data.results;
      } else if (Array.isArray(data)) {
        this.orders = data;
      } else {
        this.orders = []; 
      }
      this.isLoading = false;
    },
    error: (err: any) => {
      console.error('Error fetching orders:', err);
      this.isLoading = false;
    }
  });
}

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      default: return 'status-default';
    }
  }
}