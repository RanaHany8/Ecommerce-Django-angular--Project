import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  products: any[] = [];

  constructor(private readonly adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getProducts().subscribe(data => this.products = data);
  }
}