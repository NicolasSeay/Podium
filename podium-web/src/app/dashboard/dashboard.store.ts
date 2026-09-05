import { createAction, createFeature, createReducer, on } from '@ngrx/store';

export interface PersonalRecord {
  id: number;
  userId: number;
  lapId: number;
  trackId: number;
  vehicleId: number;
  timeMillis: number;
}

export interface AnalyticsLap {
  id: number;
  sessionId: number;
  lapNumber: number;
  timeMillis: number;
}

export interface AnalyticsSession {
  sessionId: number;
  trackDayId: number;
  trackDayDate: string;
  vehicleId: number;
  sessionName: string;
  laps: AnalyticsLap[];
}

export interface RecentTrackDay {
  id: number;
  userId: number;
  trackId: number;
  vehicleId: number;
  startDate: string;
  endDate?: string;
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
  analyticsSessions: AnalyticsSession[];
}

export interface DashboardState {
  activeNav: string;
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

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

const initialState: DashboardState = {
  activeNav: 'Dashboard',
  data: null,
  loading: false,
  error: null,
};

export const dashboardFeature = createFeature({
  name: 'dashboard',
  reducer: createReducer(
    initialState,
    on(setActiveNav, (state, { activeNav }) => ({ ...state, activeNav })),
    on(dashboardLoadRequested, (state) => ({ ...state, loading: true, error: null })),
    on(dashboardLoaded, (state, { data }) => ({ ...state, data, loading: false, error: null })),
    on(dashboardLoadFailed, (state, { error }) => ({ ...state, loading: false, error })),
  ),
});
