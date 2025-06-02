import { Route } from '@angular/router';
import { LoginRegisterComponent } from './auth/login-register/login-register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { GuestGuard } from './guards/guest.guard';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { 
    path: 'auth', 
    component: LoginRegisterComponent,
    canActivate: [GuestGuard]
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  // Wildcard route - should be last
  { path: '**', redirectTo: 'dashboard' }
];
