import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SidebarComponent } from './sidebar/sidebar.component';
import { dashboardFeature, setActiveNav } from './dashboard/dashboard.store';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { TrackDaysComponent } from './track-days/track-days.component';

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DashboardComponent, VehiclesComponent, TrackDaysComponent, SidebarComponent],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  protected readonly activeNav = this.store.selectSignal(dashboardFeature.selectActiveNav);

  constructor() {
    this.store.dispatch(setActiveNav(this.navigationLabelForUrl(this.router.url)));
  }

  protected newTrackDay(): void {
    void this.router.navigate(['/track-days']).catch(() => undefined);
  }

  private navigationLabelForUrl(url: string): string {
    const path = url.split('?')[0].split('/')[1] || 'dashboard';
    return (
      (
        { dashboard: 'Dashboard', 'track-days': 'Track Days', vehicles: 'Vehicles' } as Record<
          string,
          string
        >
      )[path] ?? 'Dashboard'
    );
  }
}
