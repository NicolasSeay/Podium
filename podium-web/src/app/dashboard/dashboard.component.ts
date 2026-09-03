import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { authFeature } from '../auth.store';
import { MetricCardComponent } from './metric-card/metric-card.component';
import { RecentDaysComponent } from './recent-days/recent-days.component';
import {
  DashboardRange,
  dashboardFeature,
  dashboardLoadRequested,
  PersonalRecord,
  setRange,
} from './dashboard.store';
import { trackDaysFeature, trackDaysLoadRequested } from '../track-days/track-days.store';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MetricCardComponent, RecentDaysComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly store = inject(Store);

  protected readonly range = this.store.selectSignal(dashboardFeature.selectRange);
  protected readonly dashboard = this.store.selectSignal(dashboardFeature.selectData);
  protected readonly loading = this.store.selectSignal(dashboardFeature.selectLoading);
  protected readonly error = this.store.selectSignal(dashboardFeature.selectError);
  protected readonly user = this.store.selectSignal(authFeature.selectUser);
  private readonly loadedTracks = this.store.selectSignal(trackDaysFeature.selectTracks);
  private readonly loadedVehicles = this.store.selectSignal(trackDaysFeature.selectVehicles);
  private readonly loadedTrackDays = this.store.selectSignal(trackDaysFeature.selectTrackDays);
  protected readonly tracks = computed(() => this.loadedTracks() ?? []);
  protected readonly vehicles = computed(() => this.loadedVehicles() ?? []);
  protected readonly trackDays = computed(() => this.loadedTrackDays() ?? []);
  protected readonly attendedTracks = computed(() => {
    const attendedTrackIds = new Set(this.trackDays().map((day) => day.trackId));
    return this.tracks().filter((track) => attendedTrackIds.has(track.id));
  });
  protected readonly selectedTrackId = signal<number | null>(null);
  protected readonly selectedVehicleId = signal<number | null>(null);
  protected readonly firstName = computed(() => this.user()?.firstName ?? 'Driver');
  protected readonly bestLap = computed(() => {
    const record = this.dashboard()?.personalRecords.reduce<PersonalRecord | null>(
      (best, current) => (best && best.timeMillis < current.timeMillis ? best : current),
      null,
    );
    return record ? this.formatLapTime(record.timeMillis) : '--';
  });
  protected readonly seatTime = computed(() =>
    this.formatDuration(this.dashboard()?.totalLapTimeMillis ?? 0),
  );

  constructor() {
    this.store.dispatch(trackDaysLoadRequested());
    this.store.dispatch(dashboardLoadRequested());
    effect(() => {
      const days = this.trackDays();
      if (!days.length || this.selectedTrackId() !== null || this.selectedVehicleId() !== null)
        return;
      const latestDay = [...days].sort((left, right) =>
        right.startDate.localeCompare(left.startDate),
      )[0];
      const latestVehicleDay = [...days]
        .filter((day) => day.vehicleId !== null)
        .sort((left, right) => right.startDate.localeCompare(left.startDate))[0];
      this.selectedTrackId.set(latestDay.trackId);
      this.selectedVehicleId.set(latestVehicleDay?.vehicleId ?? null);
      this.store.dispatch(
        dashboardLoadRequested(latestDay.trackId, latestVehicleDay?.vehicleId ?? null),
      );
    });
  }

  protected changeTrack(event: Event): void {
    const trackId = Number((event.target as HTMLSelectElement).value);
    this.selectedTrackId.set(trackId);
    this.store.dispatch(dashboardLoadRequested(trackId, this.selectedVehicleId()));
  }

  protected changeVehicle(event: Event): void {
    const vehicleId = Number((event.target as HTMLSelectElement).value);
    this.selectedVehicleId.set(vehicleId);
    this.store.dispatch(dashboardLoadRequested(this.selectedTrackId(), vehicleId));
  }

  protected changeRange(event: Event): void {
    this.store.dispatch(setRange((event.target as HTMLSelectElement).value as DashboardRange));
  }

  protected retry(): void {
    this.store.dispatch(dashboardLoadRequested());
  }

  private formatLapTime(timeMillis: number): string {
    const minutes = Math.floor(timeMillis / 60000);
    const seconds = ((timeMillis % 60000) / 1000).toFixed(3).padStart(6, '0');
    return `${minutes}:${seconds}`;
  }

  private formatDuration(timeMillis: number): string {
    const totalMinutes = Math.floor(timeMillis / 60000);
    return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
  }
}
