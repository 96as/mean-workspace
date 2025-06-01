import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

// Feature selector
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Basic selectors
export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectIsLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

// Computed selectors
export const selectUserName = createSelector(
  selectUser,
  (user) => user?.name || null
);

export const selectUserEmail = createSelector(
  selectUser,
  (user) => user?.email || null
);

export const selectUserId = createSelector(
  selectUser,
  (user) => user?.id || null
);

export const selectHasAuthError = createSelector(
  selectAuthError,
  (error) => !!error
);

export const selectIsAuthenticatedAndNotLoading = createSelector(
  selectIsAuthenticated,
  selectIsLoading,
  (isAuthenticated, isLoading) => isAuthenticated && !isLoading
);

export const selectCanShowAuthForm = createSelector(
  selectIsAuthenticated,
  selectIsLoading,
  (isAuthenticated, isLoading) => !isAuthenticated && !isLoading
);