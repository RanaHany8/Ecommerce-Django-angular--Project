import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {
  orderId: string = '';
  trackingData: any = { status: 'pending', progress: 1, location: 'Warehouse', eta: new Date() };

  constructor(private route: ActivatedRoute, private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchTrackingData();
  }

  fetchTrackingData() {
    this.orderService.getOrderTracking(this.orderId).subscribe(data => {
      this.trackingData = data;
    });
  }
}