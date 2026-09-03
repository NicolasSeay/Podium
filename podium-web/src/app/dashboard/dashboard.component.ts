import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
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
    this.store.dispatch(dashboardLoadRequested());
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
