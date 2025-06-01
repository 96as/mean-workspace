import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Store } from '@ngrx/store';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppState } from '../../store/app.state';
import * as AuthActions from '../../store/auth/auth.actions';
import * as AuthSelectors from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit, OnDestroy {
  isLoginView = true; // Toggle between login and register views
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  
  // NgRx Observables
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  isAuthenticated$: Observable<boolean>;
  
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>
  ) {
    // Initialize observables with null checks for SSR compatibility
    this.isLoading$ = this.store?.select(AuthSelectors.selectIsLoading) || of(false);
    this.error$ = this.store?.select(AuthSelectors.selectAuthError) || of(null);
    this.isAuthenticated$ = this.store?.select(AuthSelectors.selectIsAuthenticated) || of(false);
  }

  ngOnInit(): void {
    // Initialize login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Initialize register form
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check if password and confirm password match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  // Toggle between login and register views with animation
  toggleView(): void {
    this.isLoginView = !this.isLoginView;
    // Clear any existing errors when switching views
    this.clearError();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Handle login form submission
  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      const credentials: AuthActions.LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
      this.store.dispatch(AuthActions.login({ credentials }));
    }
  }

  // Handle register form submission
  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      const { confirmPassword, ...userData } = this.registerForm.value;
      const registerData: AuthActions.RegisterRequest = {
        name: userData.name,
        email: userData.email,
        password: userData.password
      };
      this.store.dispatch(AuthActions.register({ userData: registerData }));
    }
  }

  // Clear any authentication errors
  clearError(): void {
    this.store.dispatch(AuthActions.clearAuthError());
  }

  // Get form control for easier template access
  getFormControl(formName: 'login' | 'register', controlName: string) {
    const form = formName === 'login' ? this.loginForm : this.registerForm;
    return form.get(controlName);
  }

  // Check if form control has error
  hasError(formName: 'login' | 'register', controlName: string, errorType: string): boolean {
    const control = this.getFormControl(formName, controlName);
    return !!(control?.hasError(errorType) && (control?.dirty || control?.touched));
  }
}