import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, forkJoin, from, map, of, switchMap } from 'rxjs';
import { TrackDaysApiService } from './track-days-api.service';
import {
  lapCreateRequested,
  lapCreated,
  lapsLoaded,
  sessionCreateRequested,
  sessionCreated,
  sessionsLoadRequested,
  sessionsLoaded,
  trackDayCreateRequested,
  trackDayCompleteRequested,
  trackDayCompleted,
  trackDayCreated,
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
          map((data) => trackDaysLoaded(data)),
          catchError(() => of(trackDaysRequestFailed('Unable to load track-day data'))),
        ),
      ),
    ),
  );

  readonly createTrackDay$ = createEffect(() =>
    this.actions$.pipe(
      ofType(trackDayCreateRequested),
      switchMap(({ trackDay }) =>
        this.api.create(trackDay).pipe(
          map((created) => trackDayCreated(created)),
          catchError(() => of(trackDaysRequestFailed('Unable to save the track day'))),
        ),
      ),
    ),
  );

  readonly completeTrackDay$ = createEffect(() =>
    this.actions$.pipe(
      ofType(trackDayCompleteRequested),
      switchMap(({ payload }) =>
        this.api.complete(payload).pipe(
          map((completed) => trackDayCompleted(completed)),
          catchError(() => of(trackDaysRequestFailed('Unable to save the complete track day'))),
        ),
      ),
    ),
  );

  readonly loadSessions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(trackDayCreated, sessionsLoadRequested),
      switchMap((action) =>
        this.api
          .sessions(action.type === trackDayCreated.type ? action.trackDay.id : action.trackDayId)
          .pipe(
            map((sessions) => sessionsLoaded(sessions)),
            catchError(() =>
              of(trackDaysRequestFailed('Track day saved, but sessions could not be loaded')),
            ),
          ),
      ),
    ),
  );

  readonly createSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sessionCreateRequested),
      switchMap(({ trackDayId, session }) =>
        this.api.createSession(trackDayId, session).pipe(
          map((created) => sessionCreated(created)),
          catchError(() => of(trackDaysRequestFailed('Unable to save the session'))),
        ),
      ),
    ),
  );

  readonly loadLaps$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sessionCreated),
      switchMap(({ session }) =>
        this.api.laps(session.id).pipe(
          map((laps) => lapsLoaded(session.id, laps)),
          catchError(() =>
            of(trackDaysRequestFailed('Session saved, but laps could not be loaded')),
          ),
        ),
      ),
    ),
  );

  readonly loadLapsForSessions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sessionsLoaded),
      switchMap(({ sessions }) =>
        forkJoin(
          sessions.map((session) =>
            this.api.laps(session.id).pipe(
              map((laps) => lapsLoaded(session.id, laps)),
              catchError(() =>
                of(trackDaysRequestFailed('Sessions loaded, but laps could not be loaded')),
              ),
            ),
          ),
        ).pipe(switchMap((actions) => from(actions))),
      ),
    ),
  );

  readonly createLap$ = createEffect(() =>
    this.actions$.pipe(
      ofType(lapCreateRequested),
      switchMap(({ sessionId, lap }) =>
        this.api.createLap(sessionId, lap).pipe(
          map((created) => lapCreated(created)),
          catchError(() => of(trackDaysRequestFailed('Unable to save the lap'))),
        ),
      ),
    ),
  );
}
