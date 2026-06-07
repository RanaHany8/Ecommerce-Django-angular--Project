import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellerDashboardService } from '../../services/seller-dashboard.service';
import { SellerDashboard } from '../../models/seller-dashboard.model';
import { EarningsService } from '../../services/earnings.service';
import { Earnings } from '../../models/earnings.model';
import { Wallet } from '../../models/wallet.model';
import { WalletService } from '../../services/wallet.service';
@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seller-dashboard.component.html',
  styleUrl: './seller-dashboard.component.css',
})
export class SellerDashboardComponent implements OnInit {
  dashboard?: SellerDashboard;
  earnings?: Earnings;
  wallet?: Wallet;

  constructor(
    private sellerDashboardService: SellerDashboardService,
    private earningsService: EarningsService,
    private walletService: WalletService,
  ) {}

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
    this.walletService.getWallet().subscribe({
      next: (data) => {
        this.wallet = data;
      },
      error: (error) => {
        console.error(error);
      },
    });
    this.earningsService.getEarnings().subscribe({
      next: (data) => {
        this.earnings = data;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
