import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, finalize, map, Observable, of, tap, throwError } from 'rxjs';
import { AuthUser } from './store/auth.models';

interface LoginResponse {
  token: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenKey = 'podium.auth.token';
  private readonly userIdKey = 'podium.auth.user-id';

  isAuthenticated(): boolean {
    return Boolean(this.token());
  }

  token(): string | null {
    try {
      return localStorage.getItem(this.tokenKey);
    } catch {
      return null;
    }
  }

  clearSession(): void {
    try {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userIdKey);
    } catch {
      // Storage may be unavailable in restricted browser contexts.
    }
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
      tap(({ token, user }) => {
        try {
          localStorage.setItem(this.tokenKey, token);
          localStorage.setItem(this.userIdKey, String(user.id));
        } catch {
          // Continue with the authenticated response when storage is unavailable.
        }
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
        tap(({ token, user }) => {
          try {
            localStorage.setItem(this.tokenKey, token);
            localStorage.setItem(this.userIdKey, String(user.id));
          } catch {
            // Continue with the authenticated response when storage is unavailable.
          }
        }),
      );
  }

  currentUser(): Observable<AuthUser> {
    const userId = this.userId();
    return userId === null
      ? throwError(() => new Error('authenticated user id is unavailable'))
      : this.http.get<AuthUser>(`/api/users/${userId}`);
  }

  updateUser(update: {
    email: string;
    firstName: string;
    lastName: string;
    distanceUnit: AuthUser['distanceUnit'];
    temperatureUnit: AuthUser['temperatureUnit'];
    defaultTrackId: number | null;
    defaultVehicleId: number | null;
  }): Observable<AuthUser> {
    const userId = this.userId();
    return userId === null
      ? throwError(() => new Error('authenticated user id is unavailable'))
      : this.http.patch<AuthUser>(`/api/users/${userId}`, update);
  }

  private userId(): number | null {
    try {
      const value = localStorage.getItem(this.userIdKey);
      const userId = value === null ? NaN : Number(value);
      return Number.isInteger(userId) && userId > 0 ? userId : null;
    } catch {
      return null;
    }
  }
}
