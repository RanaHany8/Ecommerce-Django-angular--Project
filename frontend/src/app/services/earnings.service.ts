import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Earnings } from '../models/earnings.model';

@Injectable({
  providedIn: 'root'
})
export class EarningsService {

  private apiUrl =
    'http://127.0.0.1:8000/api/auth/earnings/';

  constructor(private http: HttpClient) {}

  getEarnings(): Observable<Earnings> {
    return this.http.get<Earnings>(this.apiUrl);
  }
}