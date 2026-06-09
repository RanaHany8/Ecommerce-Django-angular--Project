import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SellerProductsService } from '../../services/seller-products.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  productId!: number;

  product: any = {
    name: '',
    description: '',
    price: '',
    stock: 0,
    slug: '',
    category: null,
    is_active: true,
    featured: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sellerProductsService: SellerProductsService
  ) {}

  ngOnInit(): void {

    this.productId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.sellerProductsService
      .getProduct(this.productId)
      .subscribe({
        next: (data) => {
          this.product = data;
        }
      });
  }

  saveProduct() {

    this.sellerProductsService
      .updateProduct(
        this.productId,
        this.product
      )
      .subscribe({

        next: () => {

          alert('Product updated successfully');

          this.router.navigate([
            '/seller-products'
          ]);
        },

        error: (err) => {
          console.error(err);
        }
      });
  }
}