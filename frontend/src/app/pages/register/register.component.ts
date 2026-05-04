import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  register() {
    this.error = '';

    if (this.model.password !== this.model.confirmPassword) {
      this.error = "Passwords do not match";
      return;
    }

    this.loading = true;

    console.log('Register data:', this.model);

    // بعدين هنربط Django API هنا
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
}