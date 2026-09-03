import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from './auth.service';
import { authFeature, authLoggedOut } from './auth.store';
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
import { VehiclesComponent } from './vehicles/vehicles.component';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MetricCardComponent, RecentDaysComponent, VehiclesComponent],
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  protected readonly activeNav = this.store.selectSignal(dashboardFeature.selectActiveNav);
  protected readonly range = this.store.selectSignal(dashboardFeature.selectRange);
  protected readonly dashboard = this.store.selectSignal(dashboardFeature.selectData);
  protected readonly loading = this.store.selectSignal(dashboardFeature.selectLoading);
  protected readonly error = this.store.selectSignal(dashboardFeature.selectError);
  protected readonly user = this.store.selectSignal(authFeature.selectUser);
  protected readonly firstName = computed(() => this.user()?.firstName ?? 'Driver');
  protected readonly sidebarName = computed(() => {
    const user = this.user();
    return user ? `${user.firstName} ${user.lastName.charAt(0)}.` : 'Driver';
  });
  protected readonly initials = computed(() => {
    const user = this.user();
    return user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() : 'D';
  });
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
    'Vehicles',
    'Records',
    'Goals',
    'Settings',
  ];
  protected readonly navigationRoutes: Record<string, string> = {
    Dashboard: 'dashboard',
    'Track Days': 'track-days',
    Sessions: 'sessions',
    Analytics: 'analytics',
    Vehicles: 'vehicles',
    Records: 'records',
    Goals: 'goals',
    Settings: 'settings',
  };
  protected readonly implementedNavigation = new Set(['Dashboard', 'Vehicles']);
  constructor() {
    this.store.dispatch(setActiveNav(this.navigationLabelForUrl(this.router.url)));
    this.store.dispatch(dashboardLoadRequested());
  }
  protected changeNav(item: string): void {
    this.store.dispatch(setActiveNav(item));
    void this.router.navigate([this.navigationRoutes[item]]).catch(() => undefined);
  }
  protected changeRange(event: Event) {
    this.store.dispatch(setRange((event.target as HTMLSelectElement).value as DashboardRange));
  }
  protected retry() {
    this.store.dispatch(dashboardLoadRequested());
  }
  protected logout(): void {
    this.auth.logout().subscribe({
      next: () => this.finishLogout(),
      error: () => this.finishLogout(),
    });
  }

  private finishLogout(): void {
    this.store.dispatch(authLoggedOut());
    void this.router.navigate(['/login']);
  }

  private navigationLabelForUrl(url: string): string {
    const path = url.split('?')[0].split('/')[1] || 'dashboard';
    return (
      Object.entries(this.navigationRoutes).find(([, route]) => route === path)?.[0] ?? 'Dashboard'
    );
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
