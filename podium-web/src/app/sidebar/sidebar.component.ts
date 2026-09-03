import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../auth.service';
import { authFeature, authLoggedOut } from '../auth.store';
import { dashboardFeature, setActiveNav } from '../dashboard/dashboard.store';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly store = inject(Store);

  protected readonly activeNav = this.store.selectSignal(dashboardFeature.selectActiveNav);
  protected readonly user = this.store.selectSignal(authFeature.selectUser);
  protected readonly sidebarName = computed(() => {
    const user = this.user();
    return user ? `${user.firstName} ${user.lastName.charAt(0)}.` : 'Driver';
  });
  protected readonly initials = computed(() => {
    const user = this.user();
    return user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() : 'D';
  });
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
  protected readonly implementedNavigation = new Set(['Dashboard', 'Track Days', 'Vehicles']);

  protected changeNav(item: string): void {
    this.store.dispatch(setActiveNav(item));
    void this.router.navigate([this.navigationRoutes[item]]).catch(() => undefined);
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
}
