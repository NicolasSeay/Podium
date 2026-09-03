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
  private readonly userIdCookieKey = 'podium.user.id';

  isAuthenticated(): boolean {
    return Boolean(this.token());
  }

  token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  userId(): number | null {
    const cookie = document.cookie
      .split('; ')
      .find((entry) => entry.startsWith(`${this.userIdCookieKey}=`));
    const value = cookie ? Number(decodeURIComponent(cookie.split('=').slice(1).join('='))) : NaN;
    return Number.isInteger(value) && value > 0 ? value : null;
  }

  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    document.cookie = `${this.userIdCookieKey}=; Max-Age=0; Path=/; SameSite=Lax`;
  }

  logout(): Observable<void> {
    return this.http.post<void>('/api/auth/logout', {}).pipe(finalize(() => this.clearSession()));
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', { email, password }).pipe(
      tap(({ token, user }) => {
        localStorage.setItem(this.tokenKey, token);
        document.cookie = `${this.userIdCookieKey}=${encodeURIComponent(user.id)}; Max-Age=2592000; Path=/; SameSite=Lax`;
      }),
    );
  }

  currentUser(): Observable<AuthUser> {
    return this.http.get<AuthUser>('/api/users/me');
  }
}
