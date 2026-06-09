import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { Category, Product } from '../../models/store.models';
import { ProductQuery, StoreService } from '../../services/store.service';
import { AuthService } from '../../services/auth.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="luxury-wrapper">
      <div class="dynamic-bg"></div>
      <div class="glass-overlay"></div>

      <div class="container main-content">
        <header class="hero-section animate-reveal">
          <div class="hero-content">
            <span class="premium-tag">Exclusive Collection 2026</span>
            <h1 class="glitch-text">Elevate Your <span>Experience</span></h1>
            <p class="hero-subtitle">
              Where sophisticated design meets unparalleled quality. Discover the future of curated shopping.
            </p>
          </div>
        </header>

        <div class="app-grid">
          <aside class="glass-sidebar animate-slide-in">
            <div class="filter-card">
              <div class="filter-header">
                <h3>Refine Search</h3>
                <button (click)="resetFilters()" class="reset-link">Clear All</button>
              </div>

              <div class="filter-group">
                <label><i class="icon-search"></i> Search Products</label>
                <div class="input-wrapper">
                  <input [(ngModel)]="query.search" placeholder="Search unique items..." (keyup.enter)="apply()" />
                  <div class="input-focus-line"></div>
                </div>
              </div>

              <div class="filter-group">
                <label>Categories</label>
                <div class="category-pills">
                  <button [class.active]="query.category === ''" (click)="pickCategory('')">Universe</button>
                  <button
                    *ngFor="let cat of categories"
                    [class.active]="query.category === cat.id"
                    (click)="pickCategory(cat.id)"
                  >
                    {{ cat.name }}
                  </button>
                </div>
              </div>

              <div class="filter-group">
                <label>Price Spectrum</label>
                <div class="dual-range">
                  <input type="number" [(ngModel)]="query.minPrice" placeholder="Min" />
                  <span class="range-sep"></span>
                  <input type="number" [(ngModel)]="query.maxPrice" placeholder="Max" />
                </div>
              </div>

              <div class="filter-group">
                <label class="custom-switch">
                  <input type="checkbox" [(ngModel)]="query.inStock" (change)="apply()" />
                  <span class="switch-ui"></span>
                  <span class="switch-label">Ready to Ship</span>
                </label>
              </div>

              <button class="apply-trigger" (click)="apply()">Update Collection</button>
            </div>
          </aside>

          <main class="content-view">
            <div class="results-bar animate-fade">
              <div class="results-info">Found <b>{{ totalCount }}</b> Masterpieces</div>
              <div class="modern-pagination">
                <button [disabled]="page === 1 || loading" (click)="goTo(page - 1)">←</button>
                <span class="page-indicator">{{ page }} <span>/</span> {{ totalPages }}</span>
                <button [disabled]="page === totalPages || loading" (click)="goTo(page + 1)">→</button>
              </div>
            </div>

            <div class="products-grid" *ngIf="!loading && products.length; else stateBlock">
              <div
                class="art-card"
                *ngFor="let product of products; let i = index"
                [routerLink]="['/products', product.id]"
                [style.animation-delay]="i * 0.08 + 's'"
              >
                <div class="art-img-wrap">
                  <img [src]="product.primary_image || fallbackImage" [alt]="product.name" (error)="onImageError($event)" />
                  <button
                    type="button"
                    class="wishlist-heart"
                    [class.filled]="wishlistProductIds.has(product.id)"
                    (click)="toggleWishlist(product, $event)"
                    aria-label="Wishlist"
                  >
                    <svg viewBox="0 0 24 24" class="heart-svg" aria-hidden="true">
                      <path
                        d="M12 21s-6.716-4.5-9.5-8.5C1.5 10.5 2.5 7 5.5 5.5 7.5 4.5 10 5.5 12 8c2-2.5 4.5-3.5 6.5-2.5 3 1.5 4 5 2 7-2.784 4-9.5 8.5-9.5 8.5z"
                      />
                    </svg>
                  </button>
                  <div class="art-overlay">
                    <span class="view-label">View Details</span>
                  </div>
                  <div class="card-tags">
                    <span class="tag-new" *ngIf="product.featured">Featured</span>
                    <span class="tag-stock" *ngIf="product.stock < 5 && product.stock > 0">Low Stock</span>
                  </div>
                </div>
                <div class="art-info">
                  <span class="art-cat">{{ product.category?.name }}</span>
                  <h4 class="art-title">{{ product.name }}</h4>
                  <p class="art-desc">{{ product.description }}</p>
                  <div class="art-meta">
                    <span class="art-price">{{ product.price | number : '1.2-2' }} <i>USD</i></span>
                    <button 
                      type="button" 
                      class="add-to-cart-btn" 
                      (click)="addToCart(product, $event)"
                    >
                      + Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <ng-template #stateBlock>
              <div *ngIf="loading" class="products-grid">
                <div class="skeleton-art" *ngFor="let _ of skeletons"></div>
              </div>
              <div *ngIf="!loading && !products.length" class="empty-state animate-up">
                <div class="empty-icon">✧</div>
                <h3>No Items Found</h3>
                <p>Try adjusting your filters to find what you're looking for.</p>
                <button (click)="resetFilters()" class="apply-trigger small">Clear Filters</button>
              </div>
            </ng-template>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap');

      :host {
        --accent: #6366f1;
        --accent-glow: rgba(99, 102, 241, 0.4);
        --glass-bg: rgba(255, 255, 255, 0.7);
        --text-main: #0f172a;
        display: block;
        font-family: 'Plus Jakarta Sans', sans-serif;
      }

      .luxury-wrapper {
        min-height: 100vh;
        position: relative;
        padding-bottom: 5rem;
        overflow-x: hidden;
      }

      .dynamic-bg {
        position: fixed;
        inset: 0;
        background-image: url('https://t4.ftcdn.net/jpg/07/64/55/75/360_F_764557526_HlwV6rYpIxrfhrmlpTzl74INFoMmJs9Z.jpg');
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
        z-index: -2;
        transform: scale(1.05);
      }

      .glass-overlay {
        position: fixed;
        inset: 0;
        background: radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, rgba(241, 245, 249, 0.8) 100%);
        backdrop-filter: blur(8px);
        z-index: -1;
      }

      .container {
        max-width: 1440px;
        margin: 0 auto;
        padding: 0 2rem;
      }

      .hero-section {
        padding: 6rem 0 4rem; 
        text-align: center;
      }

      .premium-tag {
        background: var(--accent);
        color: white;
        padding: 0.5rem 1.5rem;
        border-radius: 50px;
        font-size: 0.8rem;
        font-weight: 800;
        letter-spacing: 2px;
        text-transform: uppercase;
        box-shadow: 0 10px 20px var(--accent-glow);
      }

      .hero-section h1 {
        font-size: clamp(2.5rem, 6vw, 4.5rem);
        font-weight: 800;
        color: var(--text-main);
        margin: 1.5rem 0;
        line-height: 1.1;
      }

      .hero-section h1 span {
        background: linear-gradient(90deg, var(--accent), #ec4899);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .hero-subtitle {
        font-size: 1.2rem;
        color: #475569;
        max-width: 600px;
        margin: 0 auto;
        font-weight: 400;
      }

      .app-grid {
        display: grid;
        grid-template-columns: 320px 1fr;
        gap: 3rem;
        margin-top: 1rem;
      }

      .glass-sidebar {
        position: sticky;
        top: 100px; 
        background: var(--glass-bg);
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 32px;
        padding: 2rem;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
        height: fit-content;
      }

      .filter-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
      }

      .filter-header h3 { font-weight: 800; font-size: 1.4rem; margin: 0; }
      
      .reset-link {
        background: none; border: none; color: var(--accent);
        font-weight: 700; cursor: pointer; font-size: 0.9rem;
      }

      .filter-group { margin-bottom: 1.8rem; }
      .filter-group label {
        display: block; font-weight: 700; font-size: 0.85rem;
        margin-bottom: 0.8rem; color: #64748b; text-transform: uppercase;
      }

      .input-wrapper {
        position: relative;
        background: white;
        border-radius: 16px;
        padding: 2px;
      }

      .input-wrapper input {
        width: 100%; border: none; padding: 1rem;
        background: transparent; outline: none; font-weight: 600;
      }

      .input-focus-line {
        position: absolute; bottom: 0; left: 50%; width: 0;
        height: 2px; background: var(--accent); transition: 0.3s;
      }

      .input-wrapper input:focus + .input-focus-line { width: 100%; left: 0; }

      .category-pills { display: flex; flex-wrap: wrap; gap: 0.6rem; }
      .category-pills button {
        padding: 0.6rem 1rem; border-radius: 12px; border: 1px solid #e2e8f0;
        background: white; cursor: pointer; transition: 0.3s; font-weight: 600;
      }

      .category-pills button.active {
        background: var(--accent); color: white; border-color: var(--accent);
        box-shadow: 0 8px 15px var(--accent-glow);
      }

      .apply-trigger {
        width: 100%; padding: 1.2rem; background: var(--text-main);
        color: white; border: none; border-radius: 18px;
        font-weight: 800; cursor: pointer; transition: 0.3s;
      }

      .apply-trigger:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(0,0,0,0.2); }

      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 2rem;
      }

      .art-card {
        background: var(--glass-bg);
        border-radius: 28px;
        padding: 0.8rem;
        border: 1px solid rgba(255,255,255,0.4);
        transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
      }

      .art-card:hover { transform: scale(1.03); background: rgba(255,255,255,0.9); }

      .wishlist-heart {
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 5;
        width: 44px;
        height: 44px;
        border: none;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.92);
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
        cursor: pointer;
        display: grid;
        place-items: center;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .wishlist-heart:hover { transform: scale(1.08); }
      .heart-svg { width: 22px; height: 22px; }
      .wishlist-heart .heart-svg path { fill: transparent; stroke: #ec4899; stroke-width: 1.6; }
      .wishlist-heart.filled .heart-svg path { fill: #ec4899; stroke: #be185d; stroke-width: 0.6; }

      .art-img-wrap {
        height: 320px; border-radius: 22px; overflow: hidden;
        position: relative; background: #f1f5f9;
      }

      .art-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: 0.6s; }
      .art-card:hover img { transform: scale(1.1); }

      .art-overlay {
        position: absolute; inset: 0; background: rgba(0,0,0,0.2);
        display: flex; align-items: center; justify-content: center;
        opacity: 0; transition: 0.3s;
      }

      .art-card:hover .art-overlay { opacity: 1; }
      .view-label { background: white; padding: 0.8rem 1.5rem; border-radius: 50px; font-weight: 800; font-size: 0.85rem; }

      .art-info { padding: 1.2rem 0.5rem; }
      .art-cat { color: var(--accent); font-weight: 800; font-size: 0.75rem; text-transform: uppercase; }
      .art-title { font-size: 1.1rem; font-weight: 800; margin: 0.4rem 0; color: var(--text-main); }
      .art-desc {
        margin: 0 0 0.8rem; color: #475569; font-weight: 600; font-size: 0.9rem; line-height: 1.45;
        display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
      }
      .art-price { font-size: 1.3rem; font-weight: 800; color: var(--accent); }
      .art-price i { font-style: normal; font-size: 0.8rem; color: #94a3b8; }

      .add-to-cart-btn {
        background: var(--text-main); color: white; border: none; 
        padding: 0.5rem 1rem; border-radius: 12px; font-weight: 700; 
        font-size: 0.85rem; cursor: pointer; transition: 0.2s; 
        position: relative; z-index: 10;
      }
      .add-to-cart-btn:hover { background: var(--accent); transform: translateY(-1px); }

      .results-bar { display: flex; justify-content: space-between; margin-bottom: 1.5rem; font-weight: 600; }
      .modern-pagination button { background: white; border: 1px solid #e2e8f0; padding: 0.3rem 0.7rem; cursor: pointer; border-radius: 6px; margin: 0 0.2rem; }
      .modern-pagination button:disabled { opacity: 0.5; cursor: not-allowed; }

      .animate-reveal { animation: reveal 1s ease-out; }
      @keyframes reveal { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

      @media (max-width: 1024px) {
        .app-grid { grid-template-columns: 1fr; }
        .glass-sidebar { position: static; }
      }
    `,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  products: Product[] = [];
  currentUserName = '';
  isLoggedIn = false;
  wishlistProductIds = new Set<number>();
  fallbackImage = 'https://placehold.co/800x1000?text=Premium+Product';
  skeletons = Array.from({ length: 6 });
  private wishSub = new Subscription();

  page = 1;
  totalPages = 1;
  totalCount = 0;
  loading = false;
  error = '';

  query: ProductQuery = {
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    ordering: '-created_at',
  };

  constructor(
    private readonly store: StoreService,
    private readonly wishlist: WishlistService,
    private readonly router: Router,
    private readonly auth: AuthService,
    private readonly cartService: CartService
  ) {}

  ngOnInit(): void {
    this.currentUserName = localStorage.getItem('user_name') || '';
    this.store.getCategories().subscribe((categories) => (this.categories = categories));
    this.load();
    this.wishSub.add(
      this.auth.authState$.subscribe((s) => {
        this.isLoggedIn = s.isLoggedIn;
        if (s.isLoggedIn) {
          this.wishlist.load().subscribe();
        }
      })
    );
    this.wishSub.add(
      this.wishlist.items$.subscribe((items) => {
        this.wishlistProductIds = new Set(items.map((i) => i.product.id));
      })
    );
  }

  ngOnDestroy(): void {
    this.wishSub.unsubscribe();
  }

  toggleWishlist(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (!localStorage.getItem('access_token')) {
      void this.router.navigate(['/login']);
      return;
    }
    this.wishlist.toggle(product.id).subscribe();
  }

  apply() { this.page = 1; this.load(); }
  resetFilters() {
    this.query = { search: '', category: '', minPrice: '', maxPrice: '', inStock: false, ordering: '-created_at' };
    this.apply();
  }
  goTo(next: number) {
    if (next < 1 || next > this.totalPages) return;
    this.page = next;
    this.load();
  }
  pickCategory(category: number | '') { this.query.category = category; this.apply(); }

  load() {
    this.loading = true;
    this.store.getProducts({ ...this.query, page: this.page }).subscribe({
      next: (res) => {
        this.products = res.results;
        this.totalCount = res.count;
        this.totalPages = Math.ceil(res.count / 9) || 1;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.message || 'Error';
      },
    });
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = this.fallbackImage;
  }

  addToCart(product: Product, event: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (!product) return;

    this.cartService.addToCart(product.id, 1).subscribe({
      next: () => {
        console.log('Product added to cart successfully!');
      },
      error: (err) => console.error('Error adding to cart', err)
    });
  }
}