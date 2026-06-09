import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellerProductsService } from '../../services/seller-products.service';
import { SellerProduct } from '../../models/seller-product.model';

@Component({
  selector: 'app-seller-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seller-products.component.html',
  styleUrls: ['./seller-products.component.css']
})
export class SellerProductsComponent implements OnInit {

  products: SellerProduct[] = [];

  constructor(
    private sellerProductsService: SellerProductsService
  ) {}

  ngOnInit(): void {

    this.sellerProductsService
      .getProducts()
      .subscribe({

        next: (data) => {
          console.log(data);
          this.products = data;
        },

        error: (err) => {
          console.error(err);
        }
      });
  }

  deleteProduct(id: number) {

    if (!confirm('Delete this product?')) {
      return;
    }

    this.sellerProductsService
      .deleteProduct(id)
      .subscribe(() => {

        this.products =
          this.products.filter(
            p => p.id !== id
          );

      });
  }
}