import { computed, Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  trackDayCompleteRequested,
  trackDaySelected,
  trackDayOptionsLoadRequested,
  trackDaysFeature,
  trackDaysLoadRequested,
} from './track-days.store';

@Injectable({ providedIn: 'root' })
export class TrackDaysFacade {
  private readonly store = inject(Store);

  private readonly storedTracks = this.store.selectSignal(trackDaysFeature.selectTracks);
  private readonly storedVehicles = this.store.selectSignal(trackDaysFeature.selectVehicles);
  readonly tracks = computed(() => this.storedTracks() ?? []);
  readonly vehicles = computed(() => this.storedVehicles() ?? []);
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

  loadOptions(): void {
    if (this.storedTracks() === undefined || this.storedVehicles() === undefined) {
      this.store.dispatch(trackDayOptionsLoadRequested());
    }
  }

  selectDay(trackDay: Parameters<typeof trackDaySelected>[0]): void {
    this.store.dispatch(trackDaySelected(trackDay));
  }

  complete(payload: Parameters<typeof trackDayCompleteRequested>[0]): void {
    this.store.dispatch(trackDayCompleteRequested(payload));
  }
}
