import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activate',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './activate.component.html',
  styleUrl: './activate.component.css',
})
export class ActivateComponent implements OnInit {
  message = '';
  /** 'loading' | 'success' | 'error' */
  phase: 'loading' | 'success' | 'error' = 'loading';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly http: HttpClient
  ) {}

  ngOnInit(): void {
    const uid = this.route.snapshot.paramMap.get('uid');
    const token = this.route.snapshot.paramMap.get('token');

    this.http
      .get<{ message?: string }>(
        `http://localhost:8000/api/auth/activate/${uid}/${token}/`
      )
      .subscribe({
        next: (res) => {
          this.message = res.message ?? 'Account activated';
          this.phase = 'success';
        },
        error: (err) => {
          const detail =
            err.error?.error ??
            err.error?.detail ??
            (typeof err.error === 'string' ? err.error : null);
          this.message = detail ?? 'Activation failed';
          this.phase = 'error';
        },
      });
  }
}
