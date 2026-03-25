import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NotificationService } from '../../modules/club-management/services/notification.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(`📤 [API] ${req.method} ${req.url}`);

    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log(`📥 [API] ${req.method} ${req.url} - ${event.status}`);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(`❌ [API] ${req.method} ${req.url} - ${error.status}: ${error.message}`);
        
        if (error.status === 0) {
          this.notificationService.error(
            'Erreur de connexion',
            'Impossible de se connecter au serveur. Vérifiez que l\'application Spring Boot est lancée.'
          );
        } else if (error.status === 404) {
          this.notificationService.error(
            'Ressource non trouvée',
            `L'URL ${req.url} n'existe pas.`
          );
        } else if (error.status === 500) {
          this.notificationService.error(
            'Erreur serveur',
            'Une erreur interne est survenue. Veuillez réessayer plus tard.'
          );
        } else if (error.error?.message) {
          this.notificationService.error('Erreur', error.error.message);
        }
        
        return throwError(() => error);
      })
    );
  }
}