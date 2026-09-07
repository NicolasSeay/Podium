import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  CategoryScale,
  Chart,
  ChartConfiguration,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { AuthFacade } from '../store/auth.facade';
import { MetricCardComponent } from './metric-card/metric-card.component';
import { AnalyticsLap, AnalyticsSession } from './store/dashboard.models';
import { DashboardFacade } from './store/dashboard.facade';
import { TrackDaysFacade } from '../track-days/store/track-days.facade';
import { DistanceUnit } from '../preferences';

Chart.register(CategoryScale, LineController, LineElement, LinearScale, PointElement, Tooltip);
Chart.defaults.font.family = "'Manrope', sans-serif";

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MetricCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  private readonly dashboardFacade = inject(DashboardFacade);
  private readonly trackDaysFacade = inject(TrackDaysFacade);
  private readonly authFacade = inject(AuthFacade);
  protected readonly math = Math;

  protected readonly dashboard = this.dashboardFacade.data;
  protected readonly loading = this.dashboardFacade.loading;
  protected readonly error = this.dashboardFacade.error;
  protected readonly user = this.authFacade.user;
  private readonly rehydrating = this.authFacade.rehydrating;
  private readonly loadedTracks = this.trackDaysFacade.tracks;
  private readonly loadedVehicles = this.trackDaysFacade.vehicles;
  private readonly loadedTrackDays = this.trackDaysFacade.trackDays;
  protected readonly tracks = computed(() => this.loadedTracks() ?? []);
  protected readonly vehicles = computed(() => this.loadedVehicles() ?? []);
  protected readonly trackDays = computed(() => this.loadedTrackDays() ?? []);
  protected readonly recentTracks = computed(() => {
    const racedTrackIds = new Set(this.trackDays().map((trackDay) => trackDay.trackId));
    return this.tracks().filter((track) => racedTrackIds.has(track.id));
  });
  protected readonly otherTracks = computed(() => {
    const recentTrackIds = new Set(this.recentTracks().map((track) => track.id));
    return this.tracks().filter((track) => !recentTrackIds.has(track.id));
  });
  protected readonly selectedTrackId = signal<number | null>(null);
  protected readonly selectedVehicleId = signal<number | null>(null);
  protected readonly firstName = computed(() => this.user()?.firstName ?? 'Driver');
  protected readonly bestLap = computed(() => {
    const times = this.analyticsSessions().flatMap((session) =>
      session.laps.map((lap) => lap.timeMillis),
    );
    return times.length ? this.formatLapTime(Math.min(...times)) : '--';
  });
  protected readonly seatTime = computed(() =>
    this.formatDuration(this.dashboard()?.totalLapTimeMillis ?? 0),
  );
  protected readonly analyticsSessions = computed(() => this.dashboard()?.analyticsSessions ?? []);
  protected readonly selectedSessionId = signal<number | null>(null);
  protected readonly sessionRows = computed(() =>
    this.analyticsSessions().map((session) => this.sessionSummary(session)),
  );
  protected readonly graphView = signal<LapTimeGraphView>('track-day');
  protected readonly graphMetric = signal<LapTimeGraphMetric>('average');
  protected readonly graphPoints = computed<LapTimeGraphPoint[]>(() => {
    const view = this.graphView();
    if (view === 'lap') {
      return this.progression().flatMap((session) =>
        session.laps.map((lap) => ({
          key: `${session.sessionId}-${lap.id}`,
          date: session.date,
          label: `${session.name} · Lap ${lap.lapNumber}`,
          timeMillis: lap.timeMillis,
        })),
      );
    }

    if (view === 'session') {
      return this.progression().map((session) => ({
        key: `${session.sessionId}`,
        date: session.date,
        label: session.name,
        timeMillis: this.graphMetric() === 'best' ? session.best : session.average,
      }));
    }

    const trackDays = new Map<number, SessionSummary[]>();
    for (const session of this.progression()) {
      const sessions = trackDays.get(session.trackDayId) ?? [];
      sessions.push(session);
      trackDays.set(session.trackDayId, sessions);
    }
    return Array.from(trackDays.values()).map((sessions) => {
      const times = sessions.flatMap((session) => session.laps.map((lap) => lap.timeMillis));
      return {
        key: `${sessions[0].trackDayId}`,
        date: sessions[0].date,
        label: sessions[0].date,
        timeMillis:
          this.graphMetric() === 'best'
            ? Math.min(...times)
            : times.reduce((sum, time) => sum + time, 0) / times.length,
      };
    });
  });
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

  @ViewChild('timelineChart')
  private set timelineCanvas(value: ElementRef<HTMLCanvasElement> | undefined) {
    if (this.timelineCanvasRef?.nativeElement !== value?.nativeElement) {
      this.timelineChart?.destroy();
      this.timelineChart = null;
    }
    this.timelineCanvasRef = value;
    if (value) this.updateTimelineChart(this.graphPoints());
  }
  private timelineCanvasRef?: ElementRef<HTMLCanvasElement>;
  private timelineChart: Chart | null = null;

  constructor() {
    this.trackDaysFacade.load();
    effect(() => {
      const points = this.graphPoints();
      if (this.timelineCanvasRef) this.updateTimelineChart(points);
    });
    effect(() => {
      const days = this.trackDays();
      const user = this.user();
      const tracks = this.tracks();
      const vehicles = this.vehicles();
      if (
        this.rehydrating() ||
        this.trackDaysFacade.loading() ||
        !days.length ||
        !tracks.length ||
        this.selectedTrackId() !== null ||
        this.selectedVehicleId() !== null
      )
        return;
      const latestDay = [...days].sort((left, right) =>
        right.startDate.localeCompare(left.startDate),
      )[0];
      const latestVehicleDay = [...days]
        .filter((day) => day.vehicleId !== null)
        .sort((left, right) => right.startDate.localeCompare(left.startDate))[0];
      const defaultTrackId =
        user?.defaultTrackId && tracks.some((track) => track.id === user.defaultTrackId)
          ? user.defaultTrackId
          : latestDay.trackId;
      const defaultVehicleId =
        user?.defaultVehicleId && vehicles.some((vehicle) => vehicle.id === user.defaultVehicleId)
          ? user.defaultVehicleId
          : (latestVehicleDay?.vehicleId ?? null);
      this.selectedTrackId.set(defaultTrackId);
      this.selectedVehicleId.set(defaultVehicleId);
      this.dashboardFacade.load(defaultTrackId, defaultVehicleId);
    });
  }

  ngAfterViewInit(): void {
    this.updateTimelineChart(this.graphPoints());
    void document.fonts?.ready.then(() => this.updateTimelineChart(this.graphPoints()));
  }

  ngOnDestroy(): void {
    this.timelineChart?.destroy();
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

  protected formatTrackLength(lengthMiles: number | null): string {
    if (lengthMiles === null) return 'Length unavailable';
    const kilometers = lengthMiles * 1.609344;
    const user = this.user();
    return user?.distanceUnit === DistanceUnit.Kilometers
      ? `${kilometers.toFixed(2)} km`
      : `${lengthMiles.toFixed(2)} mi`;
  }

  protected retry(): void {
    this.dashboardFacade.load();
  }

  protected selectSession(sessionId: number): void {
    this.selectedSessionId.set(sessionId);
  }

  protected setGraphView(view: LapTimeGraphView): void {
    this.graphView.set(view);
  }

  protected setGraphMetric(metric: LapTimeGraphMetric): void {
    this.graphMetric.set(metric);
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
      trackDayId: session.trackDayId,
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

  protected minGraphTime(values: number[]): number {
    return values.length ? Math.min(...values) : 0;
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

  private updateTimelineChart(points: LapTimeGraphPoint[]): void {
    const canvas = this.timelineCanvasRef?.nativeElement;
    const context = canvas?.getContext('2d');
    if (!context) return;

    const data: ChartConfiguration<'line'>['data'] = {
      labels: points.map((point) => point.date),
      datasets: [
        {
          data: points.map((point) => point.timeMillis),
          borderColor: '#62d2a2',
          backgroundColor: '#62d2a2',
          pointBackgroundColor: '#071a25',
          pointBorderColor: '#62d2a2',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 3,
          tension: 0.2,
        },
      ],
    };

    const options: ChartConfiguration<'line'>['options'] = {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      font: { family: "'Manrope', sans-serif" },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const point = points[context.dataIndex];
              return point ? `${point.label}: ${this.formatLapTime(point.timeMillis)}` : '';
            },
          },
        },
      },
      scales: {
        x: {
          grid: { color: '#1a3441' },
          ticks: {
            color: '#66828e',
            maxRotation: 0,
            autoSkip: true,
            font: { family: "'Manrope', sans-serif" },
          },
          title: {
            display: true,
            text: 'Date',
            color: '#66828e',
            font: { family: "'Manrope', sans-serif" },
          },
        },
        y: {
          grid: { color: '#1a3441' },
          ticks: {
            color: '#66828e',
            font: { family: "'Manrope', sans-serif" },
            callback: (value) => this.formatLapTime(Number(value)),
          },
          title: {
            display: true,
            text: 'Lap time',
            color: '#66828e',
            font: { family: "'Manrope', sans-serif" },
          },
        },
      },
    };

    if (!this.timelineChart) {
      this.timelineChart = new Chart(context, { type: 'line', data, options });
      return;
    }

    this.timelineChart.data = data;
    this.timelineChart.options = options;
    this.timelineChart.update('none');
  }
}

export interface SessionSummary {
  sessionId: number;
  date: string;
  trackDayId: number;
  name: string;
  vehicleId: number | null;
  laps: AnalyticsLap[];
  best: number;
  average: number;
  median: number;
  deviation: number;
  spread: number;
}

export type LapTimeGraphView = 'track-day' | 'session' | 'lap';
export type LapTimeGraphMetric = 'average' | 'best';

export interface LapTimeGraphPoint {
  key: string;
  date: string;
  label: string;
  timeMillis: number;
}
