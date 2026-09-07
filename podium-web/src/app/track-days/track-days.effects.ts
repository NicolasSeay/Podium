import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { TrackDaysApiService } from './track-days-api.service';
import {
  trackDayCompleteRequested,
  trackDayCompleted,
  trackDayOptionsLoaded,
  trackDayOptionsLoadRequested,
  trackDaysLoaded,
  trackDaysLoadRequested,
  trackDaysRequestFailed,
} from './track-days.store';

@Injectable()
export class TrackDaysEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(TrackDaysApiService);

  readonly load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(trackDaysLoadRequested),
      switchMap(() =>
        forkJoin({
          tracks: this.api.tracks(),
          vehicles: this.api.vehicles(),
          trackDays: this.api.list(),
          stats: this.api.stats(),
        }).pipe(
          map((data) =>
            trackDaysLoaded({
              tracks: data.tracks,
              vehicles: data.vehicles,
              trackDays: data.trackDays.map(({ trackDay }) => trackDay),
              sessions: data.trackDays.flatMap(({ sessions }) => sessions),
              laps: Object.fromEntries(data.trackDays.flatMap(({ laps }) => Object.entries(laps))),
              stats: data.stats,
            }),
          ),
          catchError(() => of(trackDaysRequestFailed('Unable to load track-day data'))),
        ),
      ),
    ),
  );

  readonly loadOptions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(trackDayOptionsLoadRequested),
      switchMap(() =>
        forkJoin({
          tracks: this.api.tracks(),
          vehicles: this.api.vehicles(),
        }).pipe(
          map((data) => trackDayOptionsLoaded(data)),
          catchError(() => of(trackDaysRequestFailed('Unable to load track options'))),
        ),
      ),
    ),
  );

  readonly completeTrackDay$ = createEffect(() =>
    this.actions$.pipe(
      ofType(trackDayCompleteRequested),
      switchMap(({ payload }) =>
        this.api.create(payload).pipe(
          map((completed) => trackDayCompleted(completed)),
          catchError(() => of(trackDaysRequestFailed('Unable to save the complete track day'))),
        ),
      ),
    ),
  );
}
