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
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="header-content">
          <div class="logo-section">
            <img src="assets/penny-logo-new.svg" alt="Penny Logo" class="logo">
          </div>
          
          <div class="user-section">
            <div class="user-info" *ngIf="user$ | async as user">
              <span class="welcome-text">Welcome, {{ user.name }}!</span>
            </div>
            

            
            <button 
              class="logout-btn" 
              (click)="logout()"
              [disabled]="isLoading$ | async"
            >
              <span *ngIf="(isLoading$ | async) === false">Logout</span>
              <span *ngIf="isLoading$ | async" class="loading-text">
                <span class="spinner-small"></span>
                Logging out...
              </span>
            </button>
          </div>
        </div>
      </header>
      
      <main class="dashboard-main">
        <div class="content-container">
          <div class="welcome-card">
            <h1>Dashboard</h1>
            <p>Welcome to your Penny dashboard! Your authentication is working perfectly.</p>
            
            <div class="feature-grid">
              <div class="feature-card">
                <h3>🔐 Secure Authentication</h3>
                <p>login is protected with JWT tokens and NgRx state management.</p>
              </div>
              
              <div class="feature-card">
                <h3>📊 State Management</h3>
                <p>Application state is managed efficiently with NgRx Store and Effects.</p>
              </div>
              
              <div class="feature-card auto-logout-card" *ngIf="timeRemaining$ | async as timeRemaining">
                <h3>⏰ Auto Logout Feature</h3>
                <p>This web application implements automatic session timeout using JWT token expiration. Your session is secured with time-based authentication that automatically logs you out when the token expires.</p>
                <div class="timer-display">
                  <span class="timer-label">Current session expires in:</span>
                  <span class="timer-value" [class.warning]="timeRemaining <= 30">
                    {{ formatTime(timeRemaining) }}
                  </span>
                </div>
              </div>
              
              <div class="feature-card">
                <h3>🛡️ Route Protection</h3>
                <p>Protected routes ensure only authenticated users can access this page.</p>
              </div>
              
              <div class="feature-card">
                <h3>🚀 Ready to Build</h3>
                <p>MEAN stack foundation is complete and ready!</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
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
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}