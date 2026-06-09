import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // ✅ تم التعديل لـ localhost لضمان مطابقة الـ Domain مع الأنجولار وعدم حجب الكوكيز
  private apiUrl = 'http://localhost:8000/api/cart/';

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialCartCount();
  }

  public loadInitialCartCount(): void {
    this.getCart().subscribe({
      next: (res) => this.updateCountFromResponse(res),
      error: (err) => {
        console.error('Error loading initial cart count', err);
        this.cartCountSubject.next(0);
      }
    });
  }

  private updateCountFromResponse(res: any): void {
    let items: any[] = [];

    if (!res) {
      this.cartCountSubject.next(0);
      return;
    }

    let targetCart: any = null;

    // 1. استخراج كائن السلة بناءً على بنية الـ Pagination من دجانجو
    if (res.results && Array.isArray(res.results) && res.results.length > 0) {
      targetCart = res.results[0];
    } else if (Array.isArray(res) && res.length > 0) {
      targetCart = res[0];
    } else {
      targetCart = res;
    }

    // 🔥 خطوة حفظ الـ session_id لتثبيت الجلسة فوراً ومنع تكرار الكارت
    if (targetCart && targetCart.session_id) {
      localStorage.setItem('cart_session_id', targetCart.session_id);
    }

    // 2. الوصول لمصفوفة الـ items الحقيقية من داخل السلة
    if (targetCart && targetCart.items && Array.isArray(targetCart.items)) {
      items = targetCart.items;
    } else if (targetCart && Array.isArray(targetCart)) {
      items = targetCart;
    }

    // 3. حساب مجموع الكميات بدقة
    if (items && items.length > 0) {
      const totalQty = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      this.cartCountSubject.next(totalQty);
    } else {
      this.cartCountSubject.next(0);
    }
  }

  // ✅ جلب السلة مع تمرير الـ session_id في الـ Query Params كأمان إضافي
  getCart(): Observable<any> {
    const sessionId = localStorage.getItem('cart_session_id') || '';
    const url = sessionId ? `${this.apiUrl}?session_id=${sessionId}` : this.apiUrl;

    return this.http.get<any>(url, { withCredentials: true }).pipe(
      tap({
        next: (res) => this.updateCountFromResponse(res),
        error: () => this.cartCountSubject.next(0)
      })
    );
  }

  // ✅ إضافة منتج مع باص الـ session_id في الـ Body لحل أزمة الـ POST المفقودة
  addToCart(productId: number, quantity: number): Observable<any> {
    const sessionId = localStorage.getItem('cart_session_id') || '';
    
    const body = { 
      product_id: productId, 
      quantity: quantity,
      session_id: sessionId 
    };

    return this.http.post<any>(`${this.apiUrl}add-item/`, body, { withCredentials: true }).pipe(
      tap({
        next: () => this.loadInitialCartCount()
      })
    );
  }

  updateQuantity(itemId: number, quantity: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}update-quantity/${itemId}/`, { quantity: quantity }, { withCredentials: true }).pipe(
      tap({
        next: () => this.loadInitialCartCount()
      })
    );
  }

  removeFromCart(itemId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}remove-item/${itemId}/`, { withCredentials: true }).pipe(
      tap({
        next: () => this.loadInitialCartCount()
      })
    );
  } 
}