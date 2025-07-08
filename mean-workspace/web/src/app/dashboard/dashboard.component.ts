import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from '../store/app.state';
import * as AuthActions from '../store/auth/auth.actions';
import * as AuthSelectors from '../store/auth/auth.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  user$: Observable<AuthActions.User | null>;
  isLoading$: Observable<boolean>;
  
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private router: Router
  ) {
    this.user$ = this.store?.select(AuthSelectors.selectUser) || of(null);
    this.isLoading$ = this.store?.select(AuthSelectors.selectIsLoading) || of(false);
  }

  ngOnInit(): void {
    // Always load user profile on component init to ensure fresh data
    this.store.dispatch(AuthActions.loadUserProfile());
    
    // Subscribe to user changes
    this.user$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      // User data will be updated via the store
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}