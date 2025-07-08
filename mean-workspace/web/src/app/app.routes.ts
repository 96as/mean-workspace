import { Route } from '@angular/router';
import { LoginRegisterComponent } from './auth/login-register/login-register.component';
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
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  // Wildcard route - should be last
  { path: '**', redirectTo: 'dashboard' }
];
