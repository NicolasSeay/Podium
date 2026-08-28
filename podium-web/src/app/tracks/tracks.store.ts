import { createAction, createFeature, createReducer, on } from '@ngrx/store';

export interface Track {
  id: number;
  userId: number;
  name: string;
  location: string | null;
}

export interface TracksState {
  tracks: Track[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const tracksLoadRequested = createAction('[Tracks] Load Requested');
export const tracksLoaded = createAction('[Tracks] Loaded', (tracks: Track[]) => ({ tracks }));
export const trackCreateRequested = createAction(
  '[Tracks] Create Requested',
  (track: { name: string; location: string | null }) => ({ track }),
);
export const trackCreated = createAction('[Tracks] Created', (track: Track) => ({ track }));
export const tracksRequestFailed = createAction('[Tracks] Request Failed', (error: string) => ({
  error,
}));

const initialState: TracksState = {
  tracks: [],
  loading: false,
  saving: false,
  error: null,
};

export const tracksFeature = createFeature({
  name: 'tracks',
  reducer: createReducer(
    initialState,
    on(tracksLoadRequested, (state) => ({ ...state, loading: true, error: null })),
    on(tracksLoaded, (state, { tracks }) => ({ ...state, tracks, loading: false, error: null })),
    on(trackCreateRequested, (state) => ({ ...state, saving: true, error: null })),
    on(trackCreated, (state, { track }) => ({
      ...state,
      tracks: [...state.tracks, track],
      saving: false,
      error: null,
    })),
    on(tracksRequestFailed, (state, { error }) => ({
      ...state,
      loading: false,
      saving: false,
      error,
    })),
  ),
});
