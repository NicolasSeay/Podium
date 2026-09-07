import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { AuthService } from '../auth.service';
import { authRehydrateFailed, authRehydrateRequested, authUserLoaded } from './auth.actions';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly auth = inject(AuthService);

  readonly rehydrate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authRehydrateRequested),
      switchMap(() =>
        this.auth.isAuthenticated()
          ? this.auth.currentUser().pipe(
              map((user) => authUserLoaded(user)),
              catchError(() => of(authRehydrateFailed())),
            )
          : of(authRehydrateFailed()),
      ),
    ),
  );
}
