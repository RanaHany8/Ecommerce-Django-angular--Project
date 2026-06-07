import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Payout } from '../models/payout.model';

@Injectable({
  providedIn: 'root'
})
export class PayoutService {

  private apiUrl =
    'http://127.0.0.1:8000/api/auth/payouts/';

  constructor(
    private http: HttpClient
  ) {}

  getPayouts(): Observable<Payout[]> {
    return this.http.get<Payout[]>(this.apiUrl);
  }
}