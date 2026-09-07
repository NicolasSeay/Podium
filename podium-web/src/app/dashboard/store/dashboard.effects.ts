import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { DashboardService } from '../dashboard.service';
import { dashboardLoadFailed, dashboardLoadRequested, dashboardLoaded } from './dashboard.actions';

@Injectable()
export class DashboardEffects {
  private readonly actions$ = inject(Actions);
  private readonly dashboardApi = inject(DashboardService);

  readonly loadDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(dashboardLoadRequested),
      switchMap(({ trackId, vehicleId }) =>
        this.dashboardApi.getDashboard(trackId ?? null, vehicleId ?? null).pipe(
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
