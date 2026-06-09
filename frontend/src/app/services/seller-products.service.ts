import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SellerProduct } from '../models/seller-product.model';

@Injectable({
  providedIn: 'root',
})
export class SellerProductsService {
  private apiUrl = 'http://127.0.0.1:8000/api/seller/products/';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<SellerProduct[]> {
    return this.http.get<SellerProduct[]>(this.apiUrl);
  }

  getProduct(id: number) {
    return this.http.get<SellerProduct>(`${this.apiUrl}${id}/`);
  }

  updateProduct(id: number, data: any) {
    return this.http.put(`${this.apiUrl}${id}/`, data);
  }

  deleteProduct(id: number) {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
