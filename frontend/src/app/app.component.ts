import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>

    <main class="main-shell">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      .main-shell {
        position: relative;
        z-index: 0;
        width: 100%;
        min-height: calc(100vh - 5.5rem);
        padding: 7rem 0 2rem;
      }
    `,
  ],
})
export class AppComponent {}
