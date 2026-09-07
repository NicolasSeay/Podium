import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import {
  trackDayCompleteRequested,
  trackDayCompleted,
  trackDayCreated,
  trackDayOptionsLoaded,
  trackDayOptionsLoadRequested,
  trackDaySelected,
  trackDaysLoaded,
  trackDaysLoadRequested,
  trackDaysRequestFailed,
  trackDayCreateRequested,
} from './track-days.actions';
import { initialState } from './track-days.store';
import { TrackDaysState } from './track-days.models';

let reducer: ActionReducer<TrackDaysState> | undefined;

export const trackDaysReducer: ActionReducer<TrackDaysState> = (
  state: TrackDaysState | undefined,
  action: Action,
) => {
  reducer ??= createReducer(
    initialState,
    on(trackDaysLoadRequested, (state) => ({ ...state, loading: true, error: null })),
    on(trackDayOptionsLoadRequested, (state) => ({ ...state, loading: true, error: null })),
    on(trackDayOptionsLoaded, (state, data) => ({
      ...state,
      tracks: data.tracks ?? [],
      vehicles: data.vehicles ?? [],
      loading: false,
      error: null,
    })),
    on(trackDaysLoaded, (state, data) => ({
      ...state,
      ...data,
      tracks: data.tracks ?? [],
      vehicles: data.vehicles ?? [],
      sessions: data.sessions ?? [],
      laps: data.laps ?? {},
      stats: Object.fromEntries((data.stats ?? []).map((summary) => [summary.trackDayId, summary])),
      loading: false,
      error: null,
    })),
    on(trackDayCreateRequested, (state) => ({
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
    on(trackDaysRequestFailed, (state, { error }) => ({
      ...state,
      loading: false,
      saving: false,
      error,
    })),
  );
  return reducer(state, action);
};
