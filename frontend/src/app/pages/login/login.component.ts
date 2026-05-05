import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  model = {
    email: '',
    password: ''
  };

  loading = false;
  error = '';

  constructor(
    private readonly store: StoreService,
    private readonly router: Router
  ) {}

  login() {
    this.error = '';
    this.loading = true;

    this.store.login(this.model).subscribe({
      next: (res) => {
        localStorage.setItem('access_token', res.access);
        localStorage.setItem('refresh_token', res.refresh);
        localStorage.setItem('user_name', res.user.username);
        this.loading = false;
        this.router.navigateByUrl('/');
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.error = err.error?.detail || 'Login failed. Check server URL or credentials.';
      },
    });
  }
}
