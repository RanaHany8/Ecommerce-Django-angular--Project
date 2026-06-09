import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Earnings } from '../../models/earnings.model';
import { EarningsService } from '../../services/earnings.service';

@Component({
  selector: 'app-seller-earnings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seller-earnings.component.html',
  styleUrls: ['./seller-earnings.component.css']
})
export class SellerEarningsComponent implements OnInit {

  earnings?: Earnings;

  constructor(
    private earningsService: EarningsService
  ) {}

  ngOnInit(): void {
    this.earningsService.getEarnings().subscribe({
      next: (data) => {
        this.earnings = data;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}