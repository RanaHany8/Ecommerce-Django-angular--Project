import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  model = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  };

  loading = false;
  submitted = false;
  error = '';
  usernameError = '';
  emailError = '';
  success = '';

  constructor(
    private readonly store: StoreService,
    private readonly router: Router
  ) {}

  get passwordsDoNotMatch(): boolean {
    return this.model.password !== '' && this.model.confirmPassword !== '' && this.model.password !== this.model.confirmPassword;
  }

  register(form: NgForm) {
    this.submitted = true;
    this.error = '';
    this.usernameError = '';
    this.emailError = '';
    this.success = '';

    if (form.invalid || this.passwordsDoNotMatch) {
      return;
    }

    this.loading = true;
    this.store
      .register({
        username: this.model.username,
        email: this.model.email,
        password: this.model.password,
      })
      .subscribe({
        next: () => {
          this.success = 'Account created successfully, please login.';
          this.loading = false;
          this.router.navigateByUrl('/login');
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          const serverError = err.error || {};

          if (serverError.username) {
            this.usernameError = Array.isArray(serverError.username)
              ? serverError.username[0]
              : serverError.username;
          }

          if (serverError.email) {
            this.emailError = Array.isArray(serverError.email)
              ? serverError.email[0]
              : serverError.email;
          }

          if (!this.usernameError && !this.emailError) {
            this.error = serverError.detail || 'Registration failed. Please check your details and try again.';
          }
        },
      });
  }
}