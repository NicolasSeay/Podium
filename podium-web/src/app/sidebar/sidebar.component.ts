import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { AuthFacade } from '../auth.facade';
import { DashboardFacade } from '../dashboard/dashboard.facade';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly authFacade = inject(AuthFacade);
  private readonly dashboardFacade = inject(DashboardFacade);

  protected readonly activeNav = this.dashboardFacade.activeNav;
  protected readonly user = this.authFacade.user;
  protected readonly sidebarName = computed(() => {
    const user = this.user();
    return user ? `${user.firstName} ${user.lastName.charAt(0)}.` : 'Driver';
  });
  protected readonly initials = computed(() => {
    const user = this.user();
    return user ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() : 'D';
  });
  protected readonly navigation = ['Dashboard', 'Track Days', 'Vehicles', 'Settings'];
  protected readonly navigationRoutes: Record<string, string> = {
    Dashboard: 'dashboard',
    'Track Days': 'track-days',
    Vehicles: 'vehicles',
    Settings: 'settings',
  };
  protected readonly implementedNavigation = new Set([
    'Dashboard',
    'Track Days',
    'Vehicles',
    'Settings',
  ]);

  protected changeNav(item: string): void {
    this.dashboardFacade.setActiveNavigation(item);
    void this.router.navigate([this.navigationRoutes[item]]).catch(() => undefined);
  }

  protected logout(): void {
    this.auth.logout().subscribe({
      next: () => this.finishLogout(),
      error: () => this.finishLogout(),
    });
  }

  private finishLogout(): void {
    this.authFacade.loggedOut();
    void this.router.navigate(['/login']);
  }
}
