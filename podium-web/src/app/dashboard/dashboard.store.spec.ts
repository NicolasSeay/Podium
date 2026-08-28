import {
  dashboardFeature,
  dashboardLoadFailed,
  dashboardLoaded,
  dashboardLoadRequested,
  DashboardData,
  setActiveNav,
  setRange,
} from './dashboard.store';

describe('dashboardFeature', () => {
  const initialState = dashboardFeature.reducer(undefined, { type: '@@init' });
  const data: DashboardData = {
    personalRecords: [],
    totalTrackDays: 2,
    totalSessions: 3,
    totalLaps: 12,
    totalLapTimeMillis: 90000,
    recentTrackDays: [],
  };

  it('updates navigation and range', () => {
    const state = dashboardFeature.reducer(initialState, setActiveNav('Tracks'));
    const nextState = dashboardFeature.reducer(state, setRange('This Year'));

    expect(nextState.activeNav).toBe('Tracks');
    expect(nextState.range).toBe('This Year');
  });

  it('tracks a pending dashboard request', () => {
    const state = dashboardFeature.reducer(initialState, dashboardLoadFailed('previous error'));

    expect(dashboardFeature.reducer(state, dashboardLoadRequested())).toMatchObject({
      loading: true,
      error: null,
    });
  });

  it('stores loaded data and clears errors', () => {
    const state = dashboardFeature.reducer(initialState, dashboardLoadFailed('failed'));

    expect(dashboardFeature.reducer(state, dashboardLoaded(data))).toMatchObject({
      data,
      loading: false,
      error: null,
    });
  });

  it('stores load errors without discarding existing data', () => {
    const loaded = dashboardFeature.reducer(initialState, dashboardLoaded(data));
    const failed = dashboardFeature.reducer(
      loaded,
      dashboardLoadFailed('Unable to load dashboard'),
    );

    expect(failed).toMatchObject({ data, loading: false, error: 'Unable to load dashboard' });
  });
});
