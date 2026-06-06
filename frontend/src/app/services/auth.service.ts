import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export interface AuthState {
  isLoggedIn: boolean;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://127.0.0.1:8000/api/auth/';
  private authState = new BehaviorSubject<AuthState>({ isLoggedIn: false, username: '' });
  readonly authState$ = this.authState.asObservable();
  get isAdmin(): boolean {
  
    const role = localStorage.getItem('user_role');
    const username = localStorage.getItem('user_name');
    return role === 'admin' || username === 'admin' || username === 'wessam'; 
  }

  constructor(private http: HttpClient) {
    this.refreshAuthState();
  }

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

  refreshAuthState(): void {
    const token = localStorage.getItem('access_token');
    const username = localStorage.getItem('user_name') || '';
    this.authState.next({
      isLoggedIn: !!token,
      username,
    });
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_name');
    this.refreshAuthState();
  }
}