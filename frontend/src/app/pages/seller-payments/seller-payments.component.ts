import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Payment } from '../../models/payment.model';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-seller-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seller-payments.component.html',
  styleUrl: './seller-payments.component.css'
})
export class SellerPaymentsComponent implements OnInit {

  payments: Payment[] = [];

  constructor(
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {

    this.paymentService.getPayments().subscribe({
      next: (data) => {
        console.log('Payments:', data);

        this.payments = data;
      },
      error: (error) => {
        console.error(error);
      }
    });

  }

}