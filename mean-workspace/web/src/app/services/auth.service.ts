import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api';
  private tokenSubject: BehaviorSubject<string | null>;
  public token$: Observable<string | null>;

  constructor(private http: HttpClient) {
    this.tokenSubject = new BehaviorSubject<string | null>(this.getStoredToken());
    this.token$ = this.tokenSubject.asObservable();
  }

  /**
   * Login user
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.token);
        })
      );
  }

  /**
   * Register new user
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, userData)
      .pipe(
        tap(response => {
          this.setToken(response.token);
        })
      );
  }

  /**
   * Logout user
   */
  logout(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.API_URL}/auth/logout`, {}, { headers })
      .pipe(
        tap(() => {
          this.clearToken();
        })
      );
  }

  /**
   * Get user profile
   */
  getUserProfile(): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<{user: User}>(`${this.API_URL}/auth/profile`, { headers })
      .pipe(
        tap(response => console.log('Profile API response:', response)),
        map(response => response.user)
      );
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Check if token is expired (basic check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return this.getStoredToken();
  }

  /**
   * Safely get token from localStorage
   */
  private getStoredToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }

  /**
   * Set token in localStorage and update subject
   */
  private setToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('token', token);
    }
    this.tokenSubject.next(token);
  }

  /**
   * Clear token from localStorage and update subject
   */
  private clearToken(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
    }
    this.tokenSubject.next(null);
  }

  /**
   * Get authorization headers
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Get headers for HTTP requests
   */
  getHttpHeaders(): HttpHeaders {
    return this.getAuthHeaders();
  }
}