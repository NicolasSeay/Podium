import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartConfiguration,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { DashboardFacade } from '../dashboard/store/dashboard.facade';
import { AnalyticsLap, AnalyticsSession } from '../dashboard/store/dashboard.models';
import { SessionSummary } from '../dashboard/dashboard.component';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
);

@Component({
  selector: 'app-analytics',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent implements AfterViewInit, OnDestroy {
  private readonly dashboardFacade = inject(DashboardFacade);
  protected readonly loading = this.dashboardFacade.loading;
  protected readonly error = this.dashboardFacade.error;
  protected readonly sessionRows = computed(() =>
    (this.dashboardFacade.data()?.analyticsSessions ?? []).map((session) =>
      this.sessionSummary(session),
    ),
  );
  protected readonly progression = computed(() =>
    this.sessionRows()
      .slice()
      .sort((left, right) => left.date.localeCompare(right.date)),
  );
  protected readonly selectedSessionId = signal<number | null>(null);
  protected readonly selectedSession = computed(
    () =>
      this.sessionRows().find((session) => session.sessionId === this.selectedSessionId()) ??
      this.sessionRows()[0] ??
      null,
  );

  @ViewChild('progressionChart') private progressionCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('consistencyChart') private consistencyCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('traceChart') private traceCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('distributionChart') private distributionCanvas?: ElementRef<HTMLCanvasElement>;
  private readonly charts: Chart[] = [];
  private viewReady = false;

  constructor() {
    effect(() => {
      if (!this.dashboardFacade.data() && !this.loading()) this.dashboardFacade.load();
      this.sessionRows();
      if (this.viewReady) this.renderCharts();
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderCharts();
  }

  ngOnDestroy(): void {
    this.charts.splice(0).forEach((chart) => chart.destroy());
  }

  protected selectSession(sessionId: number): void {
    this.selectedSessionId.set(sessionId);
  }

  protected formatLapTime(timeMillis: number): string {
    const minutes = Math.floor(timeMillis / 60000);
    const seconds = ((timeMillis % 60000) / 1000).toFixed(3).padStart(6, '0');
    return `${minutes}:${seconds}`;
  }

  protected retry(): void {
    this.dashboardFacade.load();
  }

  private sessionSummary(session: AnalyticsSession): SessionSummary {
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

  private renderCharts(): void {
    this.charts.splice(0).forEach((chart) => chart.destroy());
    const progression = this.progression();
    const selected = this.selectedSession();
    if (!progression.length || !selected) return;

    this.charts.push(
      this.createLineChart(this.progressionCanvas, {
        labels: progression.map((session) => session.date),
        datasets: [
          {
            label: 'Fastest lap',
            data: progression.map((session) => session.best),
            borderColor: '#36a7ff',
            backgroundColor: '#36a7ff',
            tension: 0.2,
          },
        ],
      }),
      this.createBarChart(this.consistencyCanvas, {
        labels: progression.map((session) => session.name),
        datasets: [
          {
            label: 'Best',
            data: progression.map((session) => session.best),
            backgroundColor: '#36a7ff',
          },
          {
            label: 'Median',
            data: progression.map((session) => session.median),
            backgroundColor: '#d6a84e',
          },
          {
            label: 'Average',
            data: progression.map((session) => session.average),
            backgroundColor: '#62d2a2',
          },
        ],
      }),
      this.createLineChart(this.traceCanvas, {
        labels: selected.laps.map((lap) => `Lap ${lap.lapNumber}`),
        datasets: [
          {
            label: selected.name,
            data: selected.laps.map((lap) => lap.timeMillis),
            borderColor: '#d6a84e',
            backgroundColor: '#d6a84e',
            tension: 0.2,
          },
        ],
      }),
      this.createBarChart(this.distributionCanvas, this.distributionData(selected.laps)),
    );
  }

  private createLineChart(
    canvas: ElementRef<HTMLCanvasElement> | undefined,
    data: ChartConfiguration<'line'>['data'],
  ): Chart<'line'> {
    return new Chart(canvas?.nativeElement as HTMLCanvasElement, {
      type: 'line',
      data,
      options: this.chartOptions<'line'>(),
    });
  }

  private createBarChart(
    canvas: ElementRef<HTMLCanvasElement> | undefined,
    data: ChartConfiguration<'bar'>['data'],
  ): Chart<'bar'> {
    return new Chart(canvas?.nativeElement as HTMLCanvasElement, {
      type: 'bar',
      data,
      options: this.chartOptions<'bar'>(),
    });
  }

  private chartOptions<T extends 'line' | 'bar'>(): ChartConfiguration<T>['options'] {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: { legend: { labels: { color: '#aac1ca' } }, tooltip: { enabled: true } },
      scales: {
        x: { grid: { color: '#1a3441' }, ticks: { color: '#66828e' } },
        y: {
          grid: { color: '#1a3441' },
          ticks: {
            color: '#66828e',
            callback: (value: string | number) => this.formatLapTime(Number(value)),
          },
        },
      },
    } as unknown as ChartConfiguration<T>['options'];
  }

  private distributionData(laps: AnalyticsLap[]): ChartConfiguration<'bar'>['data'] {
    const times = laps.map((lap) => lap.timeMillis);
    const minimum = Math.min(...times);
    const bucketSize = Math.max(
      1000,
      Math.ceil((Math.max(...times) - minimum || 1000) / 5 / 1000) * 1000,
    );
    const buckets = Array.from({ length: 5 }, (_, index) => {
      const start = minimum + index * bucketSize;
      return {
        label: this.formatLapTime(start),
        count: laps.filter((lap) => lap.timeMillis >= start && lap.timeMillis < start + bucketSize)
          .length,
      };
    });
    return {
      labels: buckets.map((bucket) => bucket.label),
      datasets: [
        { label: 'Laps', data: buckets.map((bucket) => bucket.count), backgroundColor: '#d6a84e' },
      ],
    };
  }
}
