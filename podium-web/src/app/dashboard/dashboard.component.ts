import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { AuthFacade } from '../auth.facade';
import { MetricCardComponent } from './metric-card/metric-card.component';
import { AnalyticsLap, AnalyticsSession, PersonalRecord } from './dashboard.store';
import { DashboardFacade } from './dashboard.facade';
import { TrackDaysFacade } from '../track-days/track-days.facade';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MetricCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly dashboardFacade = inject(DashboardFacade);
  private readonly trackDaysFacade = inject(TrackDaysFacade);
  private readonly authFacade = inject(AuthFacade);
  protected readonly math = Math;

  protected readonly dashboard = this.dashboardFacade.data;
  protected readonly loading = this.dashboardFacade.loading;
  protected readonly error = this.dashboardFacade.error;
  protected readonly user = this.authFacade.user;
  private readonly loadedTracks = this.trackDaysFacade.tracks;
  private readonly loadedVehicles = this.trackDaysFacade.vehicles;
  private readonly loadedTrackDays = this.trackDaysFacade.trackDays;
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
  protected readonly analyticsSessions = computed(() => this.dashboard()?.analyticsSessions ?? []);
  protected readonly selectedSessionId = signal<number | null>(null);
  protected readonly sessionRows = computed(() =>
    this.analyticsSessions().map((session) => this.sessionSummary(session)),
  );
  protected readonly selectedSession = computed(
    () =>
      this.sessionRows().find((session) => session.sessionId === this.selectedSessionId()) ??
      this.sessionRows()[0] ??
      null,
  );
  protected readonly progression = computed(() =>
    this.sessionRows()
      .slice()
      .sort((left, right) => left.date.localeCompare(right.date)),
  );
  protected readonly lapTrace = computed(() => this.selectedSession()?.laps ?? []);
  protected readonly histogram = computed(() => {
    const laps = this.lapTrace();
    if (!laps.length) return [];
    const minimum = Math.min(...laps.map((lap) => lap.timeMillis));
    const maximum = Math.max(...laps.map((lap) => lap.timeMillis));
    const bucketSize = Math.max(1000, Math.ceil((maximum - minimum || 1000) / 5 / 1000) * 1000);
    return Array.from({ length: 5 }, (_, index) => {
      const start = minimum + index * bucketSize;
      return {
        label: this.formatLapTime(start),
        count: laps.filter((lap) => lap.timeMillis >= start && lap.timeMillis < start + bucketSize)
          .length,
      };
    });
  });

  constructor() {
    this.trackDaysFacade.load();
    this.dashboardFacade.load();
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
      this.dashboardFacade.load(latestDay.trackId, latestVehicleDay?.vehicleId ?? null);
    });
  }

  protected changeTrack(event: Event): void {
    const trackId = Number((event.target as HTMLSelectElement).value);
    this.selectedTrackId.set(trackId);
    this.dashboardFacade.load(trackId, this.selectedVehicleId());
  }

  protected changeVehicle(event: Event): void {
    const vehicleId = Number((event.target as HTMLSelectElement).value);
    this.selectedVehicleId.set(vehicleId);
    this.dashboardFacade.load(this.selectedTrackId(), vehicleId);
  }

  protected retry(): void {
    this.dashboardFacade.load();
  }

  protected selectSession(sessionId: number): void {
    this.selectedSessionId.set(sessionId);
  }

  protected sessionSummary(session: AnalyticsSession): SessionSummary {
    const laps = session.laps.slice().sort((left, right) => left.lapNumber - right.lapNumber);
    const times = laps.map((lap) => lap.timeMillis);
    const average = times.reduce((sum, time) => sum + time, 0) / times.length;
    const sorted = times.slice().sort((left, right) => left - right);
    const midpoint = Math.floor(sorted.length / 2);
    const median =
      sorted.length % 2 ? sorted[midpoint] : (sorted[midpoint - 1] + sorted[midpoint]) / 2;
    const deviation = Math.sqrt(
      times.reduce((sum, time) => sum + (time - average) ** 2, 0) / times.length,
    );
    return {
      sessionId: session.sessionId,
      date: session.trackDayDate,
      name: session.sessionName,
      vehicleId: session.vehicleId,
      laps,
      best: Math.min(...times),
      average,
      median,
      deviation,
      spread: Math.max(...times) - Math.min(...times),
    };
  }

  protected chartY(value: number, minimum: number, maximum: number, height = 180): number {
    return 12 + ((value - minimum) / Math.max(maximum - minimum, 1)) * (height - 24);
  }

  protected chartX(index: number, count: number, width = 640): number {
    return count <= 1 ? width / 2 : 24 + (index / (count - 1)) * (width - 48);
  }

  protected maxTime(values: number[]): number {
    return Math.max(...values, 1);
  }

  protected minTime(values: number[]): number {
    return Math.min(...values, 0);
  }

  protected formatLapTime(timeMillis: number): string {
    const minutes = Math.floor(timeMillis / 60000);
    const seconds = ((timeMillis % 60000) / 1000).toFixed(3).padStart(6, '0');
    return `${minutes}:${seconds}`;
  }

  private formatDuration(timeMillis: number): string {
    const totalMinutes = Math.floor(timeMillis / 60000);
    return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
  }
}

export interface SessionSummary {
  sessionId: number;
  date: string;
  name: string;
  vehicleId: number | null;
  laps: AnalyticsLap[];
  best: number;
  average: number;
  median: number;
  deviation: number;
  spread: number;
}
