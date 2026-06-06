import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin';

@Component({
  selector: 'app-promo-codes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promo-codes.page.html',
  styleUrl: './promo-codes.page.css'
})
export class PromoCodes {
  code = '';
  discount = 0;

  constructor(private readonly adminService: AdminService) {}

  createCode() {
    this.adminService.createPromoCode({ code: this.code, discount: this.discount }).subscribe(() => {
      alert('Promo Code Created!');
    });
  }
}