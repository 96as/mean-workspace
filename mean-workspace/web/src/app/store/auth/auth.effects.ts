import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Login Effect
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(action =>
        this.authService.login(action.credentials).pipe(
          map(response => AuthActions.loginSuccess({ response })),
          catchError(error => {
            const errorMessage = error.error?.message || error.message || 'Login failed';
            return of(AuthActions.loginFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Register Effect
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(action =>
        this.authService.register(action.userData).pipe(
          map(response => AuthActions.registerSuccess({ response })),
          catchError(error => {
            const errorMessage = error.error?.message || error.message || 'Registration failed';
            return of(AuthActions.registerFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Logout Effect
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      exhaustMap(() =>
        this.authService.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError(() => {
            // Even if logout API fails, we still want to clear local state
            return of(AuthActions.logoutSuccess());
          })
        )
      )
    )
  );

  // Load User Profile Effect
  loadUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUserProfile),
      exhaustMap(() =>
        this.authService.getUserProfile().pipe(
          map(user => AuthActions.loadUserProfileSuccess({ user })),
          catchError(error => {
            const errorMessage = error.error?.message || error.message || 'Failed to load user profile';
            return of(AuthActions.loadUserProfileFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  // Navigation Effects
  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
      tap(() => {
        // Navigate to dashboard or home page after successful login/register
        this.router.navigate(['/dashboard']);
      })
    ),
    { dispatch: false }
  );

  logoutSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutSuccess),
      tap(() => {
        // Navigate to auth page after logout
        this.router.navigate(['/auth']);
      })
    ),
    { dispatch: false }
  );

  // Auto-load user profile on login success
  autoLoadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
      map(() => AuthActions.loadUserProfile())
    )
  );
}