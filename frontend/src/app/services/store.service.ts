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

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly api = environment.apiUrl;
  private readonly authApi = `${environment.apiUrl}/auth`;

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

  register(data: { username: string; email: string; password: string }) {
    return this.http.post(`${this.authApi}/register/`, data);
  }

  login(data: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authApi}/login/`, data);
  }

  getProfile() {
    return this.http.get(`${this.authApi}/profile/`);
  }

  updateProfile(data: { username: string; email: string; phone: string; address: string }) {
    return this.http.put(`${this.authApi}/profile/`, data);
  }
}
