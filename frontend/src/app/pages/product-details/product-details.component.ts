import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductDetails } from '../../models/store.models';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="luxury-wrapper">
      <div class="dynamic-bg"></div>
      <div class="glass-mask"></div>

      <div class="container-custom main-wrapper">
        <a routerLink="/" class="back-link group">
          <span class="icon">←</span>
          <span class="text">Back to Masterpieces</span>
        </a>

        <div class="product-showcase animate-reveal" *ngIf="product">
          <div class="grid-layout">
            
            <div class="image-container relative overflow-hidden group">
              <img [src]="selectedImage" class="main-product-img" [alt]="product.name" />
              
              <div class="thumbnails-overlay" *ngIf="product.images && product.images.length > 0">
                <div *ngFor="let img of product.images" (click)="selectedImage = img.image_url"
                     class="thumb-card"
                     [class.active]="selectedImage === img.image_url">
                  <img [src]="img.image_url" [alt]="product.name" />
                </div>
              </div>
            </div>

            <div class="info-container">
              <div class="info-content w-full">
                <nav class="breadcrumb">{{ product.category.name }} / Details</nav>
                <h2 class="product-title">{{ product.name }}</h2>
                
                <div class="price-tag">
                  <span class="amount">{{ product.price | number:'1.2-2' }}</span>
                  <span class="currency">USD</span>
                </div>

                <p class="product-desc">{{ product.description }}</p>

                <div class="action-zone">
                  <button class="btn-primary">
                    <span class="btn-text">Acquire This Piece</span>
                    <span class="btn-glow"></span>
                  </button>
                  
                  <div class="inventory-status">
                    <span class="label">Availability</span>
                    <span class="status-badge" [class.out]="product.stock <= 0">
                      {{ product.stock > 0 ? (product.stock + ' Reserved Units') : 'Sold Out' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap');

    :host {
      --primary: #6366f1;
      --accent: #f43f5e;
      --dark: #0f172a;
      --glass-white: rgba(255, 255, 255, 0.95);
      --accent-glow: rgba(99, 102, 241, 0.4);
      font-family: 'Plus Jakarta Sans', sans-serif;
      display: block;
    }

    .glass-navbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(15px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      padding: 1rem 0;
    }

    .container-custom {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 2rem;
    }

    .nav-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--dark);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
    }

    .logo-icon { color: var(--primary); font-size: 1.6rem; }
    .brand .highlight { color: var(--primary); }

    .nav-links { display: flex; gap: 2rem; }
    .nav-item {
      text-decoration: none;
      color: #64748b;
      font-weight: 600;
      font-size: 0.95rem;
      transition: 0.3s;
    }
    .nav-item:hover { color: var(--dark); }

    .nav-meta { display: flex; align-items: center; gap: 1.5rem; }
    .icon-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; }

    .cart-pill {
      background: var(--dark);
      color: white;
      padding: 0.4rem 1rem;
      border-radius: 50px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 800;
    }

    .luxury-wrapper {
      position: relative;
      min-height: 100vh;
      padding-top: 100px; 
    }

    .dynamic-bg {
      position: fixed;
      inset: 0;
      background-image: url('https://t4.ftcdn.net/jpg/07/64/55/75/360_F_764557526_HlwV6rYpIxrfhrmlpTzl74INFoMmJs9Z.jpg');
      background-size: cover;
      background-position: center;
      z-index: -2;
    }

    .glass-mask {
      position: fixed;
      inset: 0;
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(8px);
      z-index: -1;
    }

    .main-wrapper {
      padding-top: 3rem;
      padding-bottom: 5rem;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 1rem;
      color: var(--dark);
      text-decoration: none;
      font-weight: 800;
      margin-bottom: 2rem;
      transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .back-link .icon {
      padding: 0.6rem;
      background: white;
      border-radius: 50%;
      box-shadow: 0 10px 20px rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .back-link:hover { transform: translateX(-8px); color: var(--primary); }

    .product-showcase {
      background: var(--glass-white);
      border-radius: 40px;
      overflow: hidden;
      box-shadow: 0 50px 100px rgba(0,0,0,0.1);
      border: 1px solid white;
    }

    .grid-layout {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
    }

    .image-container {
      height: 750px;
      background: #f8fafc;
      position: relative;
    }
    .main-product-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: 1.5s cubic-bezier(0.19, 1, 0.22, 1);
    }
    .image-container:hover .main-product-img { transform: scale(1.05); }

    .thumbnails-overlay {
      position: absolute;
      bottom: 2rem;
      left: 2rem;
      display: flex;
      gap: 1rem;
      z-index: 10;
    }
    .thumb-card {
      width: 70px;
      height: 70px;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      border: 3px solid transparent;
      transition: 0.3s;
      box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    }
    .thumb-card img { width: 100%; height: 100%; object-fit: cover; }
    .thumb-card.active { border-color: var(--primary); transform: translateY(-5px); }

    .info-container {
      padding: 4rem;
      display: flex;
      align-items: center;
    }
    .breadcrumb {
      color: var(--primary);
      font-weight: 800;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 1rem;
    }
    .product-title {
      font-size: clamp(2rem, 4vw, 3.5rem);
      color: var(--dark);
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 1.5rem;
    }
    .price-tag {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      margin-bottom: 2rem;
    }
    .price-tag .amount { font-size: 3rem; font-weight: 800; color: var(--dark); letter-spacing: -1px; }
    .price-tag .currency { font-size: 1rem; font-weight: 700; color: #94a3b8; }

    .product-desc {
      font-size: 1.05rem;
      line-height: 1.7;
      color: #475569;
      margin-bottom: 2.5rem;
    }

    .btn-primary {
      position: relative;
      width: 100%;
      padding: 1.3rem;
      background: var(--dark);
      color: white;
      border: none;
      border-radius: 18px;
      font-weight: 800;
      font-size: 1rem;
      cursor: pointer;
      transition: 0.4s;
    }
    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 20px 40px var(--accent-glow);
      background: var(--primary);
    }

    .inventory-status {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #f1f5f9;
    }
    .inventory-status .label { font-weight: 700; color: #94a3b8; font-size: 0.8rem; text-transform: uppercase; }
    .status-badge { font-weight: 800; color: var(--primary); }

    .animate-reveal {
      animation: fadeInUp 0.8s cubic-bezier(0.19, 1, 0.22, 1) both;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 1024px) {
      .grid-layout { grid-template-columns: 1fr; }
      .image-container { height: 500px; }
      .info-container { padding: 2.5rem; }
      .nav-links { display: none; }
    }
  `]
})
export class ProductDetailsComponent implements OnInit {
  product?: ProductDetails;
  selectedImage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: StoreService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.store.getProductDetails(id).subscribe({
      next: (res) => {
        this.product = res;
        if (res.image) {
          this.selectedImage = res.image;
        } else if (res.images && res.images.length > 0) {
          this.selectedImage = res.images[0].image_url;
        } else {
          this.selectedImage = 'https://placehold.co/600x800?text=No+Image';
        }
      },
      error: (err) => console.error('Error fetching product details:', err)
    });
  }
}
