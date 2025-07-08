import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subject, interval } from 'rxjs';
import { takeUntil, map, startWith } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from '../../store/auth/auth.actions';

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss']
})
export class MainDashboardComponent implements OnInit, OnDestroy {
  timeRemaining$: Observable<number>;
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private authService: AuthService
  ) {
    // Create timer observable that updates every second
    this.timeRemaining$ = interval(1000).pipe(
      startWith(0),
      map(() => this.getTimeRemaining()),
      takeUntil(this.destroy$)
    );
  }

  ngOnInit(): void {
    // Subscribe to timer and auto-logout when time expires
    this.timeRemaining$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(timeRemaining => {
      if (timeRemaining <= 0) {
        this.store.dispatch(AuthActions.logout());
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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