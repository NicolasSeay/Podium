import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';
import { AuthUser } from './auth.store';

interface LoginResponse {
  token: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenKey = 'podium.auth.token';

  isAuthenticated(): boolean {
    return Boolean(this.token());
  }

  token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
  }

  ensureAuthenticated(): Observable<boolean> {
    if (!this.isAuthenticated()) {
      return of(false);
    }
    return this.currentUser().pipe(
      map(() => true),
      catchError(() => {
        this.clearSession();
        return of(false);
      }),
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>('/api/auth/logout', {}).pipe(finalize(() => this.clearSession()));
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', { email, password }).pipe(
      tap(({ token }) => {
        localStorage.setItem(this.tokenKey, token);
      }),
    );
  }

  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('/api/auth/register', { email, password, firstName, lastName })
      .pipe(
        tap(({ token }) => {
          localStorage.setItem(this.tokenKey, token);
        }),
      );
  }

  currentUser(): Observable<AuthUser> {
    return this.http.get<AuthUser>('/api/users/me');
  }
}
