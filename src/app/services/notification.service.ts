import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppNotification {
  type: 'success' | 'error';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notificationSubject = new BehaviorSubject<AppNotification | null>(null);
  readonly current$ = this.notificationSubject.asObservable();
  private dismissalTimer: ReturnType<typeof setTimeout> | undefined;

  success(message: string): void {
    this.show({ type: 'success', message });
  }

  error(message: string): void {
    this.show({ type: 'error', message });
  }

  dismiss(): void {
    if (this.dismissalTimer) {
      clearTimeout(this.dismissalTimer);
      this.dismissalTimer = undefined;
    }
    this.notificationSubject.next(null);
  }

  private show(notification: AppNotification): void {
    if (this.dismissalTimer) {
      clearTimeout(this.dismissalTimer);
    }
    this.notificationSubject.next(notification);
    this.dismissalTimer = setTimeout(() => this.dismiss(), notification.type === 'error' ? 6000 : 3500);
  }
}
