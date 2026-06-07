import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Wallet } from '../models/wallet.model';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  private apiUrl =
    'http://127.0.0.1:8000/api/auth/wallet/';

  constructor(
    private http: HttpClient
  ) {}

  getWallet(): Observable<Wallet> {
    return this.http.get<Wallet>(this.apiUrl);
  }
}