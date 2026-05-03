import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="container nav">
        <a class="brand" routerLink="/">ShopSphere Catalog</a>
        <nav>
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Products</a>
        </nav>
      </div>
    </header>

    <main class="main-shell">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      .header {
        position: sticky;
        top: 0;
        z-index: 10;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid #e5e7eb;
      }
      .nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 0;
      }
      .brand {
        text-decoration: none;
        font-weight: 800;
        font-size: 1.1rem;
        color: #0f172a;
      }
      nav a {
        text-decoration: none;
        color: #475569;
        font-weight: 600;
      }
      .active {
        color: #2563eb;
      }
      .main-shell {
        width: 100%;
        padding: 1.5rem 0 2rem;
      }
    `,
  ],
})
export class AppComponent {}
