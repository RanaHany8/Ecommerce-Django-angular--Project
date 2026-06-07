import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SellerDashboard } from '../models/seller-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class SellerDashboardService {

  private apiUrl =
    'http://127.0.0.1:8000/api/auth/seller-dashboard/';

  constructor(
    private http: HttpClient
  ) {}

  getDashboard(): Observable<SellerDashboard> {
    return this.http.get<SellerDashboard>(
      this.apiUrl
    );
  }
}