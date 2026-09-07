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
