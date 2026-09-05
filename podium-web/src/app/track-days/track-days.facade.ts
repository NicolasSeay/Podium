import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  lapCreateRequested,
  sessionsLoadRequested,
  trackDayCompleteRequested,
  trackDaySelected,
  trackDaysFeature,
  trackDaysLoadRequested,
} from './track-days.store';

@Injectable({ providedIn: 'root' })
export class TrackDaysFacade {
  private readonly store = inject(Store);

  readonly tracks = this.store.selectSignal(trackDaysFeature.selectTracks);
  readonly vehicles = this.store.selectSignal(trackDaysFeature.selectVehicles);
  readonly trackDays = this.store.selectSignal(trackDaysFeature.selectTrackDays);
  readonly sessions = this.store.selectSignal(trackDaysFeature.selectSessions);
  readonly laps = this.store.selectSignal(trackDaysFeature.selectLaps);
  readonly stats = this.store.selectSignal(trackDaysFeature.selectStats);
  readonly loading = this.store.selectSignal(trackDaysFeature.selectLoading);
  readonly saving = this.store.selectSignal(trackDaysFeature.selectSaving);
  readonly error = this.store.selectSignal(trackDaysFeature.selectError);
  readonly selectedDayId = this.store.selectSignal(trackDaysFeature.selectSelectedDayId);
  readonly completedTrackDayId = this.store.selectSignal(
    trackDaysFeature.selectCompletedTrackDayId,
  );

  load(): void {
    this.store.dispatch(trackDaysLoadRequested());
  }

  selectDay(trackDay: Parameters<typeof trackDaySelected>[0]): void {
    this.store.dispatch(trackDaySelected(trackDay));
    this.store.dispatch(sessionsLoadRequested(trackDay.id));
  }

  complete(payload: Parameters<typeof trackDayCompleteRequested>[0]): void {
    this.store.dispatch(trackDayCompleteRequested(payload));
  }

  createLap(sessionId: number, lap: { lapNumber: number; timeMillis: number }): void {
    this.store.dispatch(lapCreateRequested(sessionId, lap));
  }
}
