import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
  success = '';
  error = '';

  constructor(private store: StoreService) {}

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.loading = true;

    this.store.getProfile().subscribe({
      next: (res: any) => {
        this.user = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load profile';
        this.loading = false;
      }
    });
  }

  updateProfile() {
    this.store.updateProfile(this.user).subscribe({
      next: () => {
        this.success = 'Profile updated successfully ✨';
        this.error = '';
      },
      error: () => {
        this.error = 'Update failed';
        this.success = '';
      }
    });
  }
}