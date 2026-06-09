import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');

  const url = req.url || '';
  const isAuthEndpoint =
    url.includes('/api/auth/login/') ||
    url.includes('/api/auth/register/') ||
    url.includes('/api/auth/refresh/');

  let requestToSend = req.clone({
    withCredentials: true
  });

  if (token && !isAuthEndpoint) {
    requestToSend = requestToSend.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(requestToSend).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        const detail = err.error?.detail;
        if (typeof detail === 'string' && detail.includes('token')) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_name');
        }
      }
      return throwError(() => err);
    })
  );
};