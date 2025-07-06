import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, of, interval } from 'rxjs';
import { takeUntil, map, startWith } from 'rxjs/operators';
import { AppState } from '../store/app.state';
import * as AuthActions from '../store/auth/auth.actions';
import * as AuthSelectors from '../store/auth/auth.selectors';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  user$: Observable<AuthActions.User | null>;
  isLoading$: Observable<boolean>;
  timeRemaining$: Observable<number>;
  
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private authService: AuthService
  ) {
    this.user$ = this.store?.select(AuthSelectors.selectUser) || of(null);
    this.isLoading$ = this.store?.select(AuthSelectors.selectIsLoading) || of(false);
    
    // Create timer observable that updates every second
    this.timeRemaining$ = interval(1000).pipe(
      startWith(0),
      map(() => this.getTimeRemaining()),
      takeUntil(this.destroy$)
    );
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
    
    // Subscribe to timer and auto-logout when time expires
    this.timeRemaining$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(timeRemaining => {
      if (timeRemaining <= 0) {
        this.logout();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
  
  private getTimeRemaining(): number {
    const token = this.authService.getToken();
    if (!token) return 0;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeRemaining = Math.max(0, Math.floor((expirationTime - currentTime) / 1000));
      return timeRemaining;
    } catch (error) {
      return 0;
    }
  }
  
  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}