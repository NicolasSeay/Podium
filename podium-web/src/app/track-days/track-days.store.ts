import { createAction, createFeature, createReducer, on } from '@ngrx/store';

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
  tracks: Track[];
  vehicles: Vehicle[];
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

export const trackDaysLoadRequested = createAction('[Track Days] Load Requested');
export const trackDaysLoaded = createAction(
  '[Track Days] Loaded',
  (data: {
    tracks: Track[];
    vehicles: Vehicle[];
    trackDays: TrackDay[];
    stats?: TrackDayStats[];
  }) => data,
);
export const trackDayCreateRequested = createAction(
  '[Track Days] Create Requested',
  (trackDay: {
    trackId: number;
    vehicleId: number;
    startDate: string;
    notes: string | null;
    conditions: string | null;
  }) => ({ trackDay }),
);
export const trackDayCreated = createAction('[Track Days] Created', (trackDay: TrackDay) => ({
  trackDay,
}));
export const trackDayCompleteRequested = createAction(
  '[Track Days] Complete Requested',
  (payload: {
    trackId: number;
    vehicleId: number;
    startDate: string;
    endDate: string;
    notes: string | null;
    conditions: string | null;
    sessions: {
      name: string;
      notes: string | null;
      sessionDate: string;
      laps: { lapNumber: number; timeMillis: number }[];
    }[];
  }) => ({ payload }),
);
export const trackDayCompleted = createAction(
  '[Track Days] Completed',
  (completed: CompletedTrackDay) => ({ completed }),
);
export const trackDaySelected = createAction('[Track Days] Selected', (trackDay: TrackDay) => ({
  trackDay,
}));
export const sessionsLoadRequested = createAction(
  '[Track Days] Sessions Load Requested',
  (trackDayId: number) => ({ trackDayId }),
);
export const sessionsLoaded = createAction(
  '[Track Days] Sessions Loaded',
  (sessions: Session[]) => ({ sessions }),
);
export const sessionCreateRequested = createAction(
  '[Track Days] Session Create Requested',
  (trackDayId: number, session: { name: string; notes: string | null }) => ({
    trackDayId,
    session,
  }),
);
export const sessionCreated = createAction('[Track Days] Session Created', (session: Session) => ({
  session,
}));
export const lapsLoaded = createAction(
  '[Track Days] Laps Loaded',
  (sessionId: number, laps: Lap[]) => ({ sessionId, laps }),
);
export const lapCreateRequested = createAction(
  '[Track Days] Lap Create Requested',
  (sessionId: number, lap: { lapNumber: number; timeMillis: number }) => ({ sessionId, lap }),
);
export const lapCreated = createAction('[Track Days] Lap Created', (lap: Lap) => ({ lap }));
export const trackDaysRequestFailed = createAction(
  '[Track Days] Request Failed',
  (error: string) => ({ error }),
);

const initialState: TrackDaysState = {
  tracks: [],
  vehicles: [],
  trackDays: [],
  sessions: [],
  laps: {},
  stats: {},
  selectedDayId: null,
  loading: false,
  saving: false,
  error: null,
  completedTrackDayId: null,
};

export const trackDaysFeature = createFeature({
  name: 'trackDays',
  reducer: createReducer(
    initialState,
    on(trackDaysLoadRequested, (state) => ({ ...state, loading: true, error: null })),
    on(trackDaysLoaded, (state, data) => ({
      ...state,
      ...data,
      stats: Object.fromEntries((data.stats ?? []).map((summary) => [summary.trackDayId, summary])),
      loading: false,
      error: null,
    })),
    on(trackDayCreateRequested, sessionCreateRequested, lapCreateRequested, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),
    on(trackDayCreated, (state, { trackDay }) => ({
      ...state,
      trackDays: [trackDay, ...state.trackDays],
      selectedDayId: trackDay.id,
      saving: false,
    })),
    on(trackDayCompleteRequested, (state) => ({ ...state, saving: true, error: null })),
    on(trackDayCompleted, (state, { completed }) => ({
      ...state,
      trackDays: [completed.trackDay, ...state.trackDays],
      sessions: completed.sessions,
      laps: Object.fromEntries(
        completed.sessions.map((session) => [session.id, completed.laps[session.id] ?? []]),
      ),
      selectedDayId: completed.trackDay.id,
      completedTrackDayId: completed.trackDay.id,
      saving: false,
      error: null,
    })),
    on(trackDaySelected, (state, { trackDay }) => ({ ...state, selectedDayId: trackDay.id })),
    on(sessionsLoaded, (state, { sessions }) => ({
      ...state,
      sessions,
      saving: false,
      error: null,
    })),
    on(sessionCreated, (state, { session }) => ({
      ...state,
      sessions: [...state.sessions, session],
      saving: false,
      error: null,
    })),
    on(lapsLoaded, (state, { sessionId, laps }) => ({
      ...state,
      laps: { ...state.laps, [sessionId]: laps },
      saving: false,
      error: null,
    })),
    on(lapCreated, (state, { lap }) => ({
      ...state,
      laps: { ...state.laps, [lap.sessionId]: [...(state.laps[lap.sessionId] ?? []), lap] },
      saving: false,
      error: null,
    })),
    on(trackDaysRequestFailed, (state, { error }) => ({
      ...state,
      loading: false,
      saving: false,
      error,
    })),
  ),
});
