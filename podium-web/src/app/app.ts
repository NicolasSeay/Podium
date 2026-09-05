import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardFacade } from './dashboard/dashboard.facade';
import { TrackDaysComponent } from './track-days/track-days.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AppHeaderComponent } from './app-header/app-header.component';
import { AuthFacade } from './auth.facade';

@Component({
  selector: 'app-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    DashboardComponent,
    VehiclesComponent,
    TrackDaysComponent,
    SidebarComponent,
    AppHeaderComponent,
  ],
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  protected readonly dashboardFacade = inject(DashboardFacade);
  private readonly authFacade = inject(AuthFacade);

  constructor() {
    this.authFacade.rehydrate();
    this.dashboardFacade.setActiveNavigation(this.navigationLabelForUrl(this.router.url));
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
