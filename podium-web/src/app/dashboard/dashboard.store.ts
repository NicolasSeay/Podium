import { createAction, createFeature, createReducer, on } from '@ngrx/store';

export type DashboardRange = 'Last 12 Months' | 'Last 6 Months' | 'This Year';

export interface PersonalRecord {
  id: string;
  userId: string;
  lapId: string;
  trackId: string;
  vehicleId: string;
  timeMillis: number;
}

export interface RecentTrackDay {
  id: string;
  userId: string;
  trackId: string;
  vehicleId: string;
  date: string;
  notes: string | null;
  conditions: string | null;
}

export interface DashboardData {
  personalRecords: PersonalRecord[];
  totalTrackDays: number;
  totalSessions: number;
  totalLaps: number;
  totalLapTimeMillis: number;
  recentTrackDays: RecentTrackDay[];
}

export interface DashboardState {
  range: DashboardRange;
  activeNav: string;
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

export const setRange = createAction('[Dashboard] Set Range', (range: DashboardRange) => ({
  range,
}));
export const setActiveNav = createAction(
  '[Dashboard] Set Active Navigation',
  (activeNav: string) => ({ activeNav }),
);
export const dashboardLoadRequested = createAction('[Dashboard] Load Requested');
export const dashboardLoaded = createAction('[Dashboard] Loaded', (data: DashboardData) => ({
  data,
}));
export const dashboardLoadFailed = createAction('[Dashboard] Load Failed', (error: string) => ({
  error,
}));

const initialState: DashboardState = {
  range: 'Last 12 Months',
  activeNav: 'Dashboard',
  data: null,
  loading: false,
  error: null,
};

export const dashboardFeature = createFeature({
  name: 'dashboard',
  reducer: createReducer(
    initialState,
    on(setRange, (state, { range }) => ({ ...state, range })),
    on(setActiveNav, (state, { activeNav }) => ({ ...state, activeNav })),
    on(dashboardLoadRequested, (state) => ({ ...state, loading: true, error: null })),
    on(dashboardLoaded, (state, { data }) => ({ ...state, data, loading: false, error: null })),
    on(dashboardLoadFailed, (state, { error }) => ({ ...state, loading: false, error })),
  ),
});
