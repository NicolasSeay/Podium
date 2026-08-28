import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { DashboardApiService } from './dashboard-api.service';
import { dashboardLoadFailed, dashboardLoadRequested, dashboardLoaded } from './dashboard.store';

@Injectable()
export class DashboardEffects {
  private readonly actions$ = inject(Actions);
  private readonly dashboardApi = inject(DashboardApiService);

  readonly loadDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dashboardLoadRequested),
      switchMap(() =>
        this.dashboardApi.getDashboard().pipe(
          map((dashboard) => dashboardLoaded(dashboard)),
          catchError((error: unknown) =>
            of(
              dashboardLoadFailed(
                error instanceof Error ? error.message : 'Unable to load dashboard',
              ),
            ),
          ),
        ),
      ),
    ),
  );
}
