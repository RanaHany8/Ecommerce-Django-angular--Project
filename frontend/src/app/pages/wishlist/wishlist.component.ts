import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { WishlistItem } from '../../models/store.models';
import { AuthService } from '../../services/auth.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="luxury-wrapper">
      <div class="dynamic-bg"></div>
      <div class="glass-overlay"></div>

      <div class="container main-content">
        <header class="page-head animate-reveal">
          <h1>Your <span>Wishlist</span></h1>
          <p>Saved pieces you love — tap the heart to remove.</p>
        </header>

        <div *ngIf="!isLoggedIn" class="guest-hint glass-panel animate-reveal">
          <p>Sign in to view and manage your wishlist.</p>
          <a routerLink="/login" class="btn-primary">Login</a>
        </div>

        <div *ngIf="isLoggedIn && loading" class="products-grid">
          <div class="skeleton-art" *ngFor="let _ of skeletons"></div>
        </div>

        <div *ngIf="isLoggedIn && !loading && !items.length" class="empty-state glass-panel animate-reveal">
          <div class="empty-icon">♡</div>
          <h3>No saved items yet</h3>
          <p>Browse the catalog and tap the heart on any product.</p>
          <a routerLink="/" class="btn-primary">Explore catalog</a>
        </div>

        <div class="products-grid" *ngIf="isLoggedIn && !loading && items.length">
          <article
            class="art-card animate-reveal"
            *ngFor="let row of items; let i = index"
            [style.animation-delay]="i * 0.06 + 's'"
          >
            <div class="art-img-wrap" [routerLink]="['/products', row.product.id]">
              <img [src]="row.product.primary_image || fallbackImage" [alt]="row.product.name" (error)="onImgErr($event)" />
              <div class="art-overlay">
                <span class="view-label">View details</span>
              </div>
            </div>
            <div class="art-info">
              <span class="art-cat">{{ row.product.category.name }}</span>
              <h4 class="art-title" [routerLink]="['/products', row.product.id]">{{ row.product.name }}</h4>
              <p class="art-desc">{{ row.product.description }}</p>
              <div class="art-meta row-meta">
                <span class="art-price">{{ row.product.price | number : '1.2-2' }} <i>USD</i></span>
                <button
                  type="button"
                  class="heart-btn filled"
                  (click)="remove(row)"
                  [disabled]="pendingId === row.id"
                  aria-label="Remove from wishlist"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" class="heart-svg">
                    <path
                      d="M12 21s-6.716-4.5-9.5-8.5C1.5 10.5 2.5 7 5.5 5.5 7.5 4.5 10 5.5 12 8c2-2.5 4.5-3.5 6.5-2.5 3 1.5 4 5 2 7-2.784 4-9.5 8.5-9.5 8.5z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        --accent: #6366f1;
        --heart: #ec4899;
        --text-main: #0f172a;
        --glass-bg: rgba(255, 255, 255, 0.72);
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

      .main-content {
        padding-top: 1rem;
      }

      .page-head {
        text-align: center;
        padding: 2rem 0 2.5rem;
      }

      .page-head h1 {
        font-size: clamp(2rem, 5vw, 3.2rem);
        font-weight: 800;
        color: var(--text-main);
        margin: 0 0 0.75rem;
      }

      .page-head h1 span {
        background: linear-gradient(90deg, var(--accent), var(--heart));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .page-head p {
        margin: 0;
        color: #475569;
        font-weight: 600;
      }

      .glass-panel {
        background: var(--glass-bg);
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 24px;
        padding: 2.5rem;
        text-align: center;
        max-width: 480px;
        margin: 2rem auto;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
      }

      .guest-hint p {
        margin: 0 0 1.25rem;
        color: #475569;
        font-weight: 600;
      }

      .empty-state .empty-icon {
        font-size: 3rem;
        color: var(--heart);
        margin-bottom: 0.5rem;
      }

      .empty-state h3 {
        margin: 0 0 0.5rem;
        color: var(--text-main);
        font-weight: 800;
      }

      .empty-state p {
        margin: 0 0 1.5rem;
        color: #64748b;
      }

      .btn-primary {
        display: inline-block;
        padding: 0.9rem 1.75rem;
        background: var(--text-main);
        color: white;
        border-radius: 14px;
        font-weight: 800;
        text-decoration: none;
        border: none;
        cursor: pointer;
        transition: 0.25s;
      }

      .btn-primary:hover {
        background: var(--accent);
        transform: translateY(-2px);
      }

      .products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 2rem;
      }

      .art-card {
        background: var(--glass-bg);
        border-radius: 28px;
        padding: 0.8rem;
        border: 1px solid rgba(255, 255, 255, 0.4);
        transition: 0.35s ease;
      }

      .art-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
      }

      .art-img-wrap {
        height: 300px;
        border-radius: 22px;
        overflow: hidden;
        position: relative;
        background: #f1f5f9;
        cursor: pointer;
      }

      .art-img-wrap img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: 0.5s;
      }

      .art-card:hover .art-img-wrap img {
        transform: scale(1.06);
      }

      .art-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.22);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: 0.3s;
        pointer-events: none;
      }

      .art-img-wrap:hover .art-overlay {
        opacity: 1;
      }

      .view-label {
        background: white;
        padding: 0.65rem 1.25rem;
        border-radius: 999px;
        font-weight: 800;
        font-size: 0.8rem;
      }

      .art-info {
        padding: 1.1rem 0.5rem 0.4rem;
      }

      .art-cat {
        color: var(--accent);
        font-weight: 800;
        font-size: 0.72rem;
        text-transform: uppercase;
      }

      .art-title {
        font-size: 1.05rem;
        font-weight: 800;
        margin: 0.35rem 0;
        color: var(--text-main);
        cursor: pointer;
      }

      .art-desc {
        margin: 0 0 0.75rem;
        color: #475569;
        font-size: 0.88rem;
        line-height: 1.45;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .row-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
      }

      .art-price {
        font-size: 1.2rem;
        font-weight: 800;
        color: var(--accent);
      }

      .art-price i {
        font-style: normal;
        font-size: 0.75rem;
        color: #94a3b8;
      }

      .heart-btn {
        flex-shrink: 0;
        width: 44px;
        height: 44px;
        border: none;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
        box-shadow: 0 8px 20px rgba(236, 72, 153, 0.25);
        cursor: pointer;
        display: grid;
        place-items: center;
        transition: transform 0.2s;
      }

      .heart-btn:disabled {
        opacity: 0.6;
        cursor: wait;
      }

      .heart-btn:hover:not(:disabled) {
        transform: scale(1.08);
      }

      .heart-svg {
        width: 22px;
        height: 22px;
      }

      .heart-btn.filled .heart-svg path {
        fill: var(--heart);
        stroke: #be185d;
        stroke-width: 0.5;
      }

      .skeleton-art {
        height: 420px;
        border-radius: 28px;
        background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.2s infinite;
      }

      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }

      .animate-reveal {
        animation: reveal 0.7s ease both;
      }

      @keyframes reveal {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class WishlistComponent implements OnInit, OnDestroy {
  items: WishlistItem[] = [];
  isLoggedIn = false;
  loading = true;
  pendingId: number | null = null;
  fallbackImage = 'https://placehold.co/800x1000?text=Premium+Product';
  skeletons = Array.from({ length: 4 });

  private sub = new Subscription();

  constructor(
    private readonly wishlist: WishlistService,
    private readonly auth: AuthService
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.auth.authState$.subscribe((s) => {
        this.isLoggedIn = s.isLoggedIn;
        if (!s.isLoggedIn) {
          this.loading = false;
          this.items = [];
          return;
        }
        this.loading = true;
        this.wishlist.load().subscribe({
          next: () => {
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          },
        });
      })
    );
    this.sub.add(this.wishlist.items$.subscribe((list) => (this.items = list)));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  remove(row: WishlistItem): void {
    this.pendingId = row.id;
    this.wishlist.removeByRowId(row.id).subscribe({
      next: () => {
        this.pendingId = null;
      },
      error: () => {
        this.pendingId = null;
      },
    });
  }

  onImgErr(ev: Event): void {
    (ev.target as HTMLImageElement).src = this.fallbackImage;
  }
}
