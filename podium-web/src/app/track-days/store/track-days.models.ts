export interface Track {
  id: number;
  name: string;
  city: string;
  country: string;
  lengthMiles: number | null;
}

export interface Vehicle {
  id: number;
  name: string;
  make: string | null;
  model: string | null;
  year: number | null;
}

export interface TrackDay {
  id: number;
  userId: number;
  trackId: number;
  vehicleId: number;
  startDate: string;
  endDate?: string;
  notes: string | null;
  conditions: string | null;
}

export interface Session {
  id: number;
  trackDayId: number;
  name: string;
  notes: string | null;
  sessionDate?: string;
}

export interface Lap {
  id: number;
  sessionId: number;
  lapNumber: number;
  timeMillis: number;
}

export interface TrackDayStats {
  trackDayId: number;
  fastestLapTimeMillis: number;
  averageLapTimeMillis: number;
}

export interface CompletedTrackDay {
  trackDay: TrackDay;
  sessions: Session[];
  laps: Record<number, Lap[]>;
}

export interface TrackDaysState {
  tracks: Track[] | undefined;
  vehicles: Vehicle[] | undefined;
  trackDays: TrackDay[];
  sessions: Session[];
  laps: Record<number, Lap[]>;
  stats: Record<number, TrackDayStats>;
  selectedDayId: number | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  completedTrackDayId: number | null;
}
