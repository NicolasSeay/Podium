import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  authFeature,
  authLoggedOut,
  authRehydrateRequested,
  authUserLoaded,
  AuthUser,
} from './auth.store';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly store = inject(Store);

  readonly user = this.store.selectSignal(authFeature.selectUser);

  rehydrate(): void {
    this.store.dispatch(authRehydrateRequested());
  }

  loggedOut(): void {
    this.store.dispatch(authLoggedOut());
  }

  userLoaded(user: AuthUser): void {
    this.store.dispatch(authUserLoaded(user));
  }

  userName(): string {
    const user = this.user();
    return user ? `${user.firstName} ${user.lastName.charAt(0)}.` : 'Driver';
  }

  initials(): string {
    const user: AuthUser | null = this.user();
    return user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() : 'D';
  }
}
