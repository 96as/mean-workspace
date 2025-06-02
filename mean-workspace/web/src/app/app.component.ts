import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.state';
import * as AuthActions from './store/auth/auth.actions';
import { AuthService } from './services/auth.service';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'web';

  constructor(
    private store: Store<AppState>,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if user has a valid token on app initialization
    const token = this.authService.getToken();
    if (token && this.authService.isAuthenticated()) {
      // If token exists and is valid, load user profile to restore session
      this.store.dispatch(AuthActions.loadUserProfile());
    }
  }
}
