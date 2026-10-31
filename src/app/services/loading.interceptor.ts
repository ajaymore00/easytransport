import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';

export const loadingInterceptor: HttpInterceptorFn = (request, next) => {
  const loading = inject(LoadingService);
  const notifications = inject(NotificationService);

  loading.show();

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        const message =
          typeof error.error?.message === 'string'
            ? error.error.message
            : error.status === 0
              ? 'Unable to connect. Check your internet connection and try again.'
              : 'Something went wrong. Please try again.';
        notifications.error(message);
      }

      return throwError(() => error);
    }),
    finalize(() => loading.hide()),
  );
};
