import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  error = '';
  success = '';

  constructor(
    private readonly store: StoreService,
    private readonly router: Router
  ) {}

  register() {
    this.error = '';
    this.success = '';

    if (this.model.password !== this.model.confirmPassword) {
      this.error = "Passwords do not match";
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
        error: () => {
          this.error = 'Registration failed. Try another username/email.';
          this.loading = false;
        },
      });
  }
}