import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { WishlistItem } from '../models/store.models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly url = `${environment.apiUrl}/user/wishlist`;

  private readonly productIdToRowId = new Map<number, number>();
  private readonly itemsSubject = new BehaviorSubject<WishlistItem[]>([]);
  readonly items$ = this.itemsSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService
  ) {
    this.auth.authState$.subscribe((state) => {
      if (!state.isLoggedIn) {
        this.clearLocal();
      }
    });
  }

  private clearLocal(): void {
    this.productIdToRowId.clear();
    this.itemsSubject.next([]);
  }

  load(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(`${this.url}/`).pipe(
      tap((items) => {
        this.productIdToRowId.clear();
        for (const row of items) {
          this.productIdToRowId.set(row.product.id, row.id);
        }
        this.itemsSubject.next(items);
      })
    );
  }

  isInWishlist(productId: number): boolean {
    return this.productIdToRowId.has(productId);
  }

  add(productId: number): Observable<WishlistItem> {
    return this.http.post<WishlistItem>(`${this.url}/`, { product_id: productId }).pipe(
      tap((item) => {
        this.productIdToRowId.set(item.product.id, item.id);
        const cur = this.itemsSubject.value;
        const without = cur.filter((r) => r.product.id !== item.product.id);
        this.itemsSubject.next([...without, item]);
      })
    );
  }

  removeByProductId(productId: number): Observable<void> {
    const rowId = this.productIdToRowId.get(productId);
    if (rowId === undefined) {
      return of(void 0);
    }
    return this.removeByRowId(rowId);
  }

  removeByRowId(rowId: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${rowId}/`).pipe(
      tap(() => {
        const productId = [...this.productIdToRowId.entries()].find(([, id]) => id === rowId)?.[0];
        if (productId !== undefined) {
          this.productIdToRowId.delete(productId);
        }
        this.itemsSubject.next(this.itemsSubject.value.filter((i) => i.id !== rowId));
      })
    );
  }

  toggle(productId: number): Observable<'added' | 'removed'> {
    if (this.productIdToRowId.has(productId)) {
      return this.removeByProductId(productId).pipe(map(() => 'removed'));
    }
    return this.add(productId).pipe(map(() => 'added'));
  }
}
