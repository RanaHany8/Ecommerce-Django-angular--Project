import { Component, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnDestroy {
  isLoggedIn = false;
  currentUserName = '';
  showNavbar = true;
  menuOpen = false;

  private readonly subscriptions = new Subscription();

  constructor(private readonly auth: AuthService, private readonly router: Router) {
    this.subscriptions.add(
      this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event) => {
        this.updateNavbarVisibility(event.urlAfterRedirects || event.url);
        this.syncAuthState();
      })
    );

    this.subscriptions.add(
      this.auth.authState$.subscribe((state) => {
        this.isLoggedIn = state.isLoggedIn;
        this.currentUserName = state.username;
      })
    );

    this.updateNavbarVisibility(this.router.url);
    this.syncAuthState();
  }

  get avatarInitial(): string {
    return (this.currentUserName || 'U').charAt(0).toUpperCase();
  }

  toggleDropdown(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.auth.logout();
    this.menuOpen = false;
    this.router.navigateByUrl('/login');
  }

  updateNavbarVisibility(url: string): void {
    const hiddenRoutes = ['/login', '/register'];
    this.showNavbar = !hiddenRoutes.some((route) => url.startsWith(route));
  }

  syncAuthState(): void {
    this.auth.refreshAuthState();
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target || (!target.closest('.user-pill') && !target.closest('.dropdown-menu'))) {
      this.menuOpen = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
