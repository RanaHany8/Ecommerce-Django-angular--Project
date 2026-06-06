import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ProductReview } from '../models/store.models';

export interface ReviewCreatePayload {
  product: number;
  rating: number;
  comment: string;
}

export interface ReviewUpdatePayload {
  rating: number;
  comment: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly base = `${environment.apiUrl}/user/reviews`;

  constructor(private readonly http: HttpClient) {}

  listByProduct(productId: number): Observable<ProductReview[]> {
    const params = new HttpParams().set('product', String(productId));
    return this.http.get<ProductReview[]>(`${this.base}/`, { params });
  }

  create(payload: ReviewCreatePayload): Observable<ProductReview> {
    return this.http.post<ProductReview>(`${this.base}/`, payload);
  }

  update(reviewId: number, payload: ReviewUpdatePayload): Observable<ProductReview> {
    return this.http.put<ProductReview>(`${this.base}/${reviewId}/`, payload);
  }

  delete(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${reviewId}/`);
  }
}
