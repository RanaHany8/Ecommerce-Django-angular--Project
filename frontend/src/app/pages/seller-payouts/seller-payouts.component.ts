import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Payout } from '../../models/payout.model';
import { PayoutService } from '../../services/payout.service';

@Component({
  selector: 'app-seller-payouts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seller-payouts.component.html',
  styleUrls: ['./seller-payouts.component.css']
})
export class SellerPayoutsComponent implements OnInit {

  payouts: Payout[] = [];

  constructor(
    private payoutService: PayoutService
  ) {}

  ngOnInit(): void {
    this.payoutService.getPayouts().subscribe({
      next: (data) => {
        this.payouts = data;
      }
    });
  }
}