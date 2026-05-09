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
}