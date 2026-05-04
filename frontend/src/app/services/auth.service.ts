import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://127.0.0.1:8000/api/auth/';

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(this.baseUrl + 'register/', data);
  }

  login(data: any) {
    return this.http.post(this.baseUrl + 'login/', data);
  }

  getProfile() {
    return this.http.get(this.baseUrl + 'profile/');
  }

  updateProfile(data: any) {
    return this.http.put(this.baseUrl + 'profile/update/', data);
  }
}