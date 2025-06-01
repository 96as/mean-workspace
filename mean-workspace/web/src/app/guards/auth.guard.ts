import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import * as AuthSelectors from '../store/auth/auth.selectors';
import * as AuthActions from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(AuthSelectors.selectIsAuthenticated).pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          return true;
        } else {
          // If user has a token but not authenticated, try to load profile
          const token = this.getStoredToken();
          if (token) {
            this.store.dispatch(AuthActions.loadUserProfile());
          }
          
          // Redirect to auth page
          return this.router.createUrlTree(['/auth']);
        }
      })
    );
  }

  /**
   * Safely get token from localStorage
   */
  private getStoredToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }
}