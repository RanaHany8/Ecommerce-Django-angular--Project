import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { SellerDashboardService } from '../../services/seller-dashboard.service';
import { EarningsService } from '../../services/earnings.service';
import { WalletService } from '../../services/wallet.service';
import { PayoutService } from '../../services/payout.service';

import { SellerDashboard } from '../../models/seller-dashboard.model';
import { Earnings } from '../../models/earnings.model';
import { Wallet } from '../../models/wallet.model';
import { Payout } from '../../models/payout.model';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './seller-dashboard.component.html',
  styleUrl: './seller-dashboard.component.css',
})
export class SellerDashboardComponent implements OnInit {

  dashboard?: SellerDashboard;

  earnings?: Earnings;

  wallet?: Wallet;

  payouts: Payout[] = [];

  constructor(
    private sellerDashboardService: SellerDashboardService,
    private earningsService: EarningsService,
    private walletService: WalletService,
    private payoutService: PayoutService
  ) {}

  ngOnInit(): void {

    this.sellerDashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard = data;
      },
      error: (error) => {
        console.error(error);
      }
    });

    this.earningsService.getEarnings().subscribe({
      next: (data) => {
        this.earnings = data;
      },
      error: (error) => {
        console.error(error);
      }
    });

    this.walletService.getWallet().subscribe({
      next: (data) => {
        this.wallet = data;
      },
      error: (error) => {
        console.error(error);
      }
    });

    this.payoutService.getPayouts().subscribe({
      next: (data) => {
        this.payouts = data;
      },
      error: (error) => {
        console.error(error);
      }
    });

  }

}