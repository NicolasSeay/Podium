import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { dashboardFeature, dashboardLoadRequested, setActiveNav } from './dashboard.store';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private readonly store = inject(Store);

  readonly data = this.store.selectSignal(dashboardFeature.selectData);
  readonly loading = this.store.selectSignal(dashboardFeature.selectLoading);
  readonly error = this.store.selectSignal(dashboardFeature.selectError);
  readonly activeNav = this.store.selectSignal(dashboardFeature.selectActiveNav);
  readonly activeNav$ = this.store.select(dashboardFeature.selectActiveNav);

  load(trackId: number | null = null, vehicleId: number | null = null): void {
    this.store.dispatch(dashboardLoadRequested(trackId, vehicleId));
  }

  setActiveNavigation(label: string): void {
    this.store.dispatch(setActiveNav(label));
  }
}
