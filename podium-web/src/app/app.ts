import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  dashboardFeature,
  DashboardRange,
  dashboardLoadRequested,
  PersonalRecord,
  setActiveNav,
  setRange,
} from './dashboard/dashboard.store';
import { MetricCardComponent } from './dashboard/metric-card/metric-card.component';
import { RecentDaysComponent } from './dashboard/recent-days/recent-days.component';
import { TracksComponent } from './tracks/tracks.component';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MetricCardComponent, RecentDaysComponent, TracksComponent],
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly store = inject(Store);
  protected readonly activeNav = this.store.selectSignal(dashboardFeature.selectActiveNav);
  protected readonly range = this.store.selectSignal(dashboardFeature.selectRange);
  protected readonly dashboard = this.store.selectSignal(dashboardFeature.selectData);
  protected readonly loading = this.store.selectSignal(dashboardFeature.selectLoading);
  protected readonly error = this.store.selectSignal(dashboardFeature.selectError);
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
  protected readonly navigation = [
    'Dashboard',
    'Track Days',
    'Sessions',
    'Analytics',
    'Tracks',
    'Vehicles',
    'Records',
    'Goals',
    'Settings',
  ];
  constructor() {
    this.store.dispatch(dashboardLoadRequested());
  }
  protected changeNav(item: string) {
    this.store.dispatch(setActiveNav(item));
  }
  protected changeRange(event: Event) {
    this.store.dispatch(setRange((event.target as HTMLSelectElement).value as DashboardRange));
  }
  protected retry() {
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
