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
import { trackDaysFeature } from './track-days.store';

describe('trackDaysReducer', () => {
  const track = {
    id: 2,
    name: 'Road Atlanta',
    city: 'Braselton',
    country: 'US',
    lengthMiles: 2.54,
  };
  const vehicle = { id: 3, name: 'MX-5', make: 'Mazda', model: 'Miata', year: 2020 };
  const trackDay = {
    id: 7,
    userId: 1,
    trackId: 2,
    vehicleId: 3,
    startDate: '2026-09-04',
    endDate: '2026-09-04',
    notes: null,
    conditions: 'Dry',
  };
  const session = { id: 4, trackDayId: 7, name: 'Practice', notes: null };
  const lap = { id: 11, sessionId: 4, lapNumber: 1, timeMillis: 92350 };

  it('initializes with empty aggregate collections', () => {
    expect(trackDaysFeature.reducer(undefined, { type: '@@init' })).toMatchObject({
      trackDays: [],
      sessions: [],
      laps: {},
      stats: {},
      selectedDayId: null,
      completedTrackDayId: null,
    });
  });

  it('tracks loading requests and normalizes empty options', () => {
    const loading = trackDaysFeature.reducer(undefined, trackDaysLoadRequested());
    expect(loading).toMatchObject({ loading: true, error: null });

    const optionsLoading = trackDaysFeature.reducer(loading, trackDayOptionsLoadRequested());
    expect(optionsLoading).toMatchObject({ loading: true, error: null });
    expect(
      trackDaysFeature.reducer(
        optionsLoading,
        trackDayOptionsLoaded({ tracks: null, vehicles: null }),
      ),
    ).toMatchObject({ tracks: [], vehicles: [], loading: false, error: null });
  });

  it('normalizes and indexes a loaded aggregate', () => {
    const state = trackDaysFeature.reducer(
      undefined,
      trackDaysLoaded({
        tracks: [track],
        vehicles: [vehicle],
        trackDays: [trackDay],
        sessions: [session],
        laps: { 4: [lap] },
        stats: [{ trackDayId: 7, fastestLapTimeMillis: 92350, averageLapTimeMillis: 92350 }],
      }),
    );

    expect(state.tracks).toEqual([track]);
    expect(state.vehicles).toEqual([vehicle]);
    expect(state.sessions).toEqual([session]);
    expect(state.laps[4]).toEqual([lap]);
    expect(state.stats[7].fastestLapTimeMillis).toBe(92350);
    expect(state.loading).toBe(false);
  });

  it('normalizes omitted aggregate collections', () => {
    const state = trackDaysFeature.reducer(
      undefined,
      trackDaysLoaded({ tracks: null, vehicles: null, trackDays: [] }),
    );

    expect(state).toMatchObject({ tracks: [], vehicles: [], sessions: [], laps: {}, stats: {} });
  });

  it('tracks creation and selects the created day', () => {
    const saving = trackDaysFeature.reducer(
      undefined,
      trackDayCreateRequested({
        trackId: 2,
        vehicleId: 3,
        startDate: '2026-09-04',
        notes: null,
        conditions: null,
      }),
    );

    expect(saving).toMatchObject({ saving: true, error: null });
    const state = trackDaysFeature.reducer(saving, trackDayCreated(trackDay));
    expect(state.trackDays[0]).toEqual(trackDay);
    expect(state.selectedDayId).toBe(7);
    expect(state.saving).toBe(false);
  });

  it('stores completed sessions and fills missing lap collections', () => {
    const state = trackDaysFeature.reducer(
      undefined,
      trackDayCompleted({ trackDay, sessions: [session], laps: {} }),
    );

    expect(state.sessions).toEqual([session]);
    expect(state.laps).toEqual({ 4: [] });
    expect(state.completedTrackDayId).toBe(7);
    expect(state.selectedDayId).toBe(7);
    expect(state.error).toBeNull();
  });

  it('selects an existing day', () => {
    expect(trackDaysFeature.reducer(undefined, trackDaySelected(trackDay)).selectedDayId).toBe(7);
  });

  it('tracks completion requests and failures', () => {
    const saving = trackDaysFeature.reducer(
      undefined,
      trackDayCompleteRequested({
        trackId: 2,
        vehicleId: 3,
        startDate: '2026-09-04',
        endDate: '2026-09-04',
        notes: null,
        conditions: null,
        sessions: [],
      }),
    );

    expect(saving).toMatchObject({ saving: true, error: null });
    expect(
      trackDaysFeature.reducer(saving, trackDaysRequestFailed('Unable to save track day')),
    ).toMatchObject({ loading: false, saving: false, error: 'Unable to save track day' });
  });
});
