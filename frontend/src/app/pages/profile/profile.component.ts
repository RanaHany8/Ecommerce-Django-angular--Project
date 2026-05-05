import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {
    username: '',
    email: '',
    phone: '',
    address: ''
  };

  loading = false;
  editMode = false;
  success = '';
  error = '';

  constructor(
    private readonly store: StoreService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.loading = true;
    this.error = '';

    this.store.getProfile().subscribe({
      next: (res: any) => {
        this.user = {
          username: res?.username ?? '',
          email: res?.email ?? '',
          phone: res?.phone ?? '',
          address: res?.address ?? '',
        };
        localStorage.setItem('user_name', this.user.username || '');
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.error = 'Please login first.';
          this.loading = false;
          this.router.navigateByUrl('/login');
          return;
        }

        this.error = err.error?.detail || 'Failed to load profile';
        this.loading = false;
      }
    });
  }

  startEdit() {
    this.success = '';
    this.error = '';
    this.editMode = true;
  }

  cancelEdit() {
    this.editMode = false;
    this.error = '';
    this.getProfile();
  }

  updateProfile() {
    this.store.updateProfile(this.user).subscribe({
      next: () => {
        this.editMode = false;
        this.success = 'Profile updated successfully ✨';
        this.error = '';
        localStorage.setItem('user_name', this.user.username || '');
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.error = 'Session expired. Please login again.';
          this.success = '';
          this.router.navigateByUrl('/login');
          return;
        }

        this.error = err.error?.detail || 'Update failed';
        this.success = '';
      }
    });
  }

  get avatarLetter(): string {
    return (this.user.username || this.user.email || 'U').charAt(0).toUpperCase();
  }
}