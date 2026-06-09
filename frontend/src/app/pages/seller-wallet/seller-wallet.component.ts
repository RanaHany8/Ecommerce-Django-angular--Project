import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Wallet } from '../../models/wallet.model';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-seller-wallet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seller-wallet.component.html',
  styleUrls: ['./seller-wallet.component.css']
})
export class SellerWalletComponent implements OnInit {

  wallet?: Wallet;

  constructor(
    private walletService: WalletService
  ) {}

  ngOnInit(): void {
    this.walletService.getWallet().subscribe({
      next: (data) => {
        this.wallet = data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}