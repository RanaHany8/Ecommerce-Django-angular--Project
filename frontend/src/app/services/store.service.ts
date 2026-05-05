import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ApiListResponse, Category, Product, ProductDetails } from '../models/store.models';

export interface ProductQuery {
  search?: string;
  category?: number | '';
  minPrice?: number | '';
  maxPrice?: number | '';
  inStock?: boolean;
  ordering?: string;
  page?: number;
}

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly api = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.api}/categories/`);
  }

  getProducts(query: ProductQuery): Observable<ApiListResponse<Product>> {
    let params = new HttpParams().set('page', query.page ?? 1);

    if (query.search) params = params.set('search', query.search.trim());
    if (query.category) params = params.set('category', query.category);
    if (query.minPrice !== '' && query.minPrice !== undefined) params = params.set('min_price', query.minPrice);
    if (query.maxPrice !== '' && query.maxPrice !== undefined) params = params.set('max_price', query.maxPrice);
    if (query.inStock) params = params.set('in_stock', 'true');
    if (query.ordering) params = params.set('ordering', query.ordering);

    return this.http.get<ApiListResponse<Product>>(`${this.api}/products/`, { params });
  }

  getProductDetails(id: number): Observable<ProductDetails> {
    return this.http.get<ProductDetails>(`${this.api}/products/${id}/`);
  }

  getProfile() {
  return this.http.get('/api/auth/profile/');
}

updateProfile(data: any) {
  return this.http.put('/api/auth/profile/', data);
}
}
