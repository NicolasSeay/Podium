import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { dashboardFeature, DashboardRange, setActiveNav, setRange } from './dashboard/dashboard.store';
import { MetricCardComponent } from './dashboard/metric-card/metric-card.component';
import { ProgressChartComponent } from './dashboard/progress-chart/progress-chart.component';
import { RecentDaysComponent } from './dashboard/recent-days/recent-days.component';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MetricCardComponent, ProgressChartComponent, RecentDaysComponent],
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly store = inject(Store);
  protected readonly activeNav = this.store.selectSignal(dashboardFeature.selectActiveNav);
  protected readonly range = this.store.selectSignal(dashboardFeature.selectRange);
  protected readonly navigation = ['Dashboard', 'Track Days', 'Sessions', 'Analytics', 'Tracks', 'Vehicles', 'Records', 'Goals', 'Settings'];
  protected changeNav(item: string) { this.store.dispatch(setActiveNav(item)); }
  protected changeRange(event: Event) { this.store.dispatch(setRange((event.target as HTMLSelectElement).value as DashboardRange)); }
}
