import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { TracksApiService } from './tracks-api.service';
import {
  trackCreateRequested,
  trackCreated,
  tracksLoaded,
  tracksLoadRequested,
  tracksRequestFailed,
} from './tracks.store';

@Injectable()
export class TracksEffects {
  private readonly actions$ = inject(Actions);
  private readonly tracksApi = inject(TracksApiService);

  readonly loadTracks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(tracksLoadRequested),
      switchMap(() =>
        this.tracksApi.list().pipe(
          map((tracks) => tracksLoaded(tracks)),
          catchError(() => of(tracksRequestFailed('Unable to load tracks'))),
        ),
      ),
    ),
  );

  readonly createTrack$ = createEffect(() =>
    this.actions$.pipe(
      ofType(trackCreateRequested),
      switchMap(({ track }) =>
        this.tracksApi.create(track).pipe(
          map((createdTrack) => trackCreated(createdTrack)),
          catchError(() => of(tracksRequestFailed('Unable to create track'))),
        ),
      ),
    ),
  );
}
