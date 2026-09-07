import { createAction } from '@ngrx/store';
import {
  CompletedTrackDay,
  Lap,
  Session,
  Track,
  TrackDay,
  TrackDayStats,
  Vehicle,
} from './track-days.models';

export const trackDaysLoadRequested = createAction('[Track Days] Load Requested');
export const trackDayOptionsLoadRequested = createAction('[Track Days] Options Load Requested');
export const trackDaysLoaded = createAction(
  '[Track Days] Loaded',
  (data: {
    tracks: Track[] | null;
    vehicles: Vehicle[] | null;
    trackDays: TrackDay[];
    sessions?: Session[];
    laps?: Record<number, Lap[]>;
    stats?: TrackDayStats[];
  }) => data,
);
export const trackDayOptionsLoaded = createAction(
  '[Track Days] Options Loaded',
  (data: { tracks: Track[] | null; vehicles: Vehicle[] | null }) => data,
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
export const trackDaysRequestFailed = createAction(
  '[Track Days] Request Failed',
  (error: string) => ({ error }),
);
