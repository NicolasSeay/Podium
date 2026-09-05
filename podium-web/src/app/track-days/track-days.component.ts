import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  sessionsLoadRequested,
  trackDaySelected,
  trackDaysFeature,
  trackDaysLoadRequested,
  TrackDay,
} from './track-days.store';

@Component({
  selector: 'app-track-days',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './track-days.component.html',
  styleUrl: './track-days.component.scss',
})
export class TrackDaysComponent {
  private readonly store = inject(Store);
  protected readonly tracks = this.store.selectSignal(trackDaysFeature.selectTracks);
  protected readonly vehicles = this.store.selectSignal(trackDaysFeature.selectVehicles);
  protected readonly trackDays = this.store.selectSignal(trackDaysFeature.selectTrackDays);
  protected readonly sessions = this.store.selectSignal(trackDaysFeature.selectSessions);
  protected readonly laps = this.store.selectSignal(trackDaysFeature.selectLaps);
  protected readonly stats = this.store.selectSignal(trackDaysFeature.selectStats);
  protected readonly loading = this.store.selectSignal(trackDaysFeature.selectLoading);
  protected readonly error = this.store.selectSignal(trackDaysFeature.selectError);
  protected readonly selectedDayId = this.store.selectSignal(trackDaysFeature.selectSelectedDayId);
  protected readonly selectedDay = computed(
    () => this.trackDays().find((day) => day.id === this.selectedDayId()) ?? null,
  );

  constructor() {
    this.store.dispatch(trackDaysLoadRequested());
  }

  protected openDay(day: TrackDay): void {
    this.store.dispatch(trackDaySelected(day));
    this.store.dispatch(sessionsLoadRequested(day.id));
  }
  protected trackName(trackId: number): string {
    return this.tracks().find((track) => track.id === trackId)?.name ?? `Track ${trackId}`;
  }
  protected vehicleName(vehicleId: number): string {
    return vehicleId
      ? (this.vehicles().find((vehicle) => vehicle.id === vehicleId)?.name ??
          `Vehicle ${vehicleId}`)
      : 'No vehicle';
  }
  protected formatLapTime(timeMillis: number): string {
    return `${Math.floor(timeMillis / 60000)}:${((timeMillis % 60000) / 1000).toFixed(3).padStart(6, '0')}`;
  }
  protected formatDateRange(day: TrackDay): string {
    return day.endDate && day.endDate !== day.startDate
      ? `${day.startDate} - ${day.endDate}`
      : day.startDate;
  }
  protected fastestLap(dayId: number): string {
    const time = this.stats()[dayId]?.fastestLapTimeMillis ?? 0;
    return time ? this.formatLapTime(time) : '--';
  }
  protected averageLapTime(dayId: number): string {
    const time = this.stats()[dayId]?.averageLapTimeMillis ?? 0;
    return time ? this.formatLapTime(time) : '--';
  }
}
