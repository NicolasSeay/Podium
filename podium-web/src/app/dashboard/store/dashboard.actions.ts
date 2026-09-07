import { createAction } from '@ngrx/store';
import { DashboardData } from './dashboard.models';

export const setActiveNav = createAction(
  '[Dashboard] Set Active Navigation',
  (activeNav: string) => ({ activeNav }),
);
export const dashboardLoadRequested = createAction(
  '[Dashboard] Load Requested',
  (trackId: number | null = null, vehicleId: number | null = null) => ({ trackId, vehicleId }),
);
export const dashboardLoaded = createAction('[Dashboard] Loaded', (data: DashboardData) => ({
  data,
}));
export const dashboardLoadFailed = createAction('[Dashboard] Load Failed', (error: string) => ({
  error,
}));
