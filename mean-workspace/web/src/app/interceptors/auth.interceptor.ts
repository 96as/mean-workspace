import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AppState } from '../store/app.state';
import * as AuthActions from '../store/auth/auth.actions';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service
    const authToken = this.authService.getToken();

    // Clone the request and add the authorization header if token exists
    let authReq = req;
    if (authToken && this.shouldAddToken(req.url)) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
    }

    // Handle the request and catch any authentication errors
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle 401 Unauthorized errors
        if (error.status === 401) {
          // Clear the invalid token and redirect to auth
          this.store.dispatch(AuthActions.logoutSuccess());
          this.router.navigate(['/auth']);
        }
        
        return throwError(() => error);
      })
    );
  }

  /**
   * Determine if we should add the auth token to this request
   */
  private shouldAddToken(url: string): boolean {
    // Add token to all API requests except login and register
    const isApiRequest = url.includes('/api/');
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');
    
    return isApiRequest && !isAuthEndpoint;
  }
}