import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ProductReview } from '../../models/store.models';
import { AuthService } from '../../services/auth.service';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-reviews.component.html',
  styleUrl: './product-reviews.component.css',
})
export class ProductReviewsComponent implements OnChanges {
  @Input({ required: true }) productId!: number;
  @Input() averageRating: number | null = null;
  @Input() reviewCount = 0;
  @Output() readonly statsChanged = new EventEmitter<void>();

  reviews: ProductReview[] = [];
  loading = false;
  error = '';

  isLoggedIn = false;
  currentUsername = '';

  /** Form / edit state */
  draftRating = 5;
  draftComment = '';
  editingReview: ProductReview | null = null;
  formSubmitting = false;
  formError = '';

  readonly stars = [1, 2, 3, 4, 5];

  get roundedAverage(): number {
    return Math.round(this.averageRating ?? 0);
  }

  constructor(
    private readonly reviewsApi: ReviewService,
    private readonly auth: AuthService
  ) {
    this.auth.authState$.subscribe((s) => {
      this.isLoggedIn = s.isLoggedIn;
      this.currentUsername = s.username;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productId'] && this.productId != null) {
      this.loadReviews();
    }
  }

  get myReview(): ProductReview | undefined {
    if (!this.currentUsername) {
      return undefined;
    }
    return this.reviews.find((r) => r.username === this.currentUsername);
  }

  get hasMyReview(): boolean {
    return this.myReview !== undefined;
  }

  loadReviews(): void {
    if (this.productId == null) {
      return;
    }
    this.loading = true;
    this.error = '';
    this.reviewsApi.listByProduct(this.productId).subscribe({
      next: (rows) => {
        this.reviews = rows;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.error = this.formatHttpError(err);
      },
    });
  }

  startEdit(review: ProductReview): void {
    this.formError = '';
    this.editingReview = review;
    this.draftRating = review.rating;
    this.draftComment = review.comment;
  }

  cancelForm(): void {
    this.editingReview = null;
    this.formError = '';
    this.draftComment = '';
    this.draftRating = 5;
  }

  submitForm(): void {
    if (!this.isLoggedIn || this.formSubmitting) {
      return;
    }
    this.formSubmitting = true;
    this.formError = '';

    const rating = Math.min(5, Math.max(1, Math.round(this.draftRating)));
    const comment = (this.draftComment || '').trim();

    if (this.editingReview) {
      this.reviewsApi.update(this.editingReview.id, { rating, comment }).subscribe({
        next: () => {
          this.formSubmitting = false;
          this.editingReview = null;
          this.loadReviews();
          this.statsChanged.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.formSubmitting = false;
          this.formError = this.formatHttpError(err);
        },
      });
      return;
    }

    if (this.hasMyReview) {
      this.formSubmitting = false;
      this.formError = 'You have already reviewed this product.';
      return;
    }

    this.reviewsApi
      .create({ product: this.productId, rating, comment })
      .subscribe({
        next: () => {
          this.formSubmitting = false;
          this.draftComment = '';
          this.draftRating = 5;
          this.loadReviews();
          this.statsChanged.emit();
        },
        error: (err: HttpErrorResponse) => {
          this.formSubmitting = false;
          this.formError = this.formatHttpError(err);
        },
      });
  }

  deleteReview(review: ProductReview): void {
    if (!confirm('Remove your review?')) {
      return;
    }
    this.reviewsApi.delete(review.id).subscribe({
      next: () => {
        this.loadReviews();
        this.statsChanged.emit();
        if (this.editingReview?.id === review.id) {
          this.cancelForm();
        }
      },
      error: (err: HttpErrorResponse) => {
        this.error = this.formatHttpError(err);
      },
    });
  }

  setDraftRating(value: number): void {
    this.draftRating = value;
  }

  trackByReviewId(_: number, r: ProductReview): number {
    return r.id;
  }

  private formatHttpError(err: HttpErrorResponse): string {
    const d = err.error;
    if (d?.detail) {
      return Array.isArray(d.detail) ? d.detail.join(' ') : String(d.detail);
    }
    if (typeof d === 'object' && d) {
      const first = Object.values(d)[0];
      if (Array.isArray(first)) {
        return first.join(' ');
      }
    }
    return err.message || 'Something went wrong.';
  }
}
