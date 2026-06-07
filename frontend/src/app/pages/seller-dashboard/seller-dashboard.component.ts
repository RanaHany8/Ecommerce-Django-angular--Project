import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellerDashboardService } from '../../services/seller-dashboard.service';
import { SellerDashboard } from '../../models/seller-dashboard.model';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seller-dashboard.component.html',
  styleUrl: './seller-dashboard.component.css',
})
export class SellerDashboardComponent implements OnInit {
  dashboard?: SellerDashboard;

  constructor(private sellerDashboardService: SellerDashboardService) {}

  ngOnInit(): void {
    this.sellerDashboardService.getDashboard().subscribe({
      next: (data) => {
        console.log('Dashboard Data:', data);

        this.dashboard = data;
      },
      error: (error) => {
        console.log('ERROR STATUS:', error.status);
        console.log('ERROR RESPONSE:', error.error);
        console.log('FULL ERROR:', error);
      },
    });
  }
}
