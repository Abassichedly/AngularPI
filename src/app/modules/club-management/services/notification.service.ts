import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface Notification {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new Subject<Notification>();
  private idCounter = 0;

  notifications$: Observable<Notification> = this.notificationsSubject.asObservable();

  success(title: string, message: string, duration: number = 3000): void {
    this.show({ type: 'success', title, message, duration });
  }

  error(title: string, message: string, duration: number = 5000): void {
    this.show({ type: 'error', title, message, duration });
  }

  warning(title: string, message: string, duration: number = 4000): void {
    this.show({ type: 'warning', title, message, duration });
  }

  info(title: string, message: string, duration: number = 3000): void {
    this.show({ type: 'info', title, message, duration });
  }

  private show(notification: Omit<Notification, 'id'>): void {
    const id = ++this.idCounter;
    this.notificationsSubject.next({ ...notification, id });
    
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, notification.duration);
    }
  }

  remove(id: number): void {
    this.notificationsSubject.next({ id, type: 'info', title: '', message: '', duration: 0 });
  }
}