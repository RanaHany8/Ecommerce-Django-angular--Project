import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // تأكدي من المسار الصحيح

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = `${environment.apiUrl}/orders`; 

  constructor(private http: HttpClient) { }

  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/`, orderData);
  }

  getUserOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/`); 
  }
  
  getOrderDetails(orderId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${orderId}/`);
  }
  
  getOrderTracking(orderId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/orders/${orderId}/`);
  }
}