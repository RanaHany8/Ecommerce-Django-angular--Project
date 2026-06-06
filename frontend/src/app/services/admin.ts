import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AdminStats, AdminUser } from '../models/admin.models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private dashboardUrl = `${environment.apiUrl}/dashboard/`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.dashboardUrl}stats/`);
  }

  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.dashboardUrl}users/`);
  }

  toggleUserStatus(userId: number): Observable<any> {
    return this.http.patch(`${this.dashboardUrl}users/${userId}/`, {});
  }

 
  createPromoCode(promoData: { code: string; discount: number }): Observable<any> {
    return this.http.post(`${this.dashboardUrl}promo-codes/`, promoData);
  }
}