import { createFeature } from '@ngrx/store';
import { trackDaysReducer } from './track-days.reducer';
import { TrackDaysState } from './track-days.models';

export const initialState: TrackDaysState = {
  tracks: undefined,
  vehicles: undefined,
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
  reducer: trackDaysReducer,
});
