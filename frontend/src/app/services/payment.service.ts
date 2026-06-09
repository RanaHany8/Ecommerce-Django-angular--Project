import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl =
    'http://127.0.0.1:8000/api/auth/payments/';

  constructor(
    private http: HttpClient
  ) {}

  getPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }
  deleteProduct(id: number) {
  return this.http.delete(
    `${this.apiUrl}${id}/`
  );
}
}