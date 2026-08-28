import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { finalize, Observable, tap } from 'rxjs';
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

  logout(): Observable<void> {
    return this.http.post<void>('/api/auth/logout', {}).pipe(finalize(() => this.clearSession()));
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('/api/auth/login', { email, password })
      .pipe(tap(({ token }) => localStorage.setItem(this.tokenKey, token)));
  }
}
