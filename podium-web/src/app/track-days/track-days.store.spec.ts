import { trackDayCompleted, trackDaysFeature } from './track-days.store';

describe('trackDaysFeature', () => {
  it('stores a nested track day as one domain update', () => {
    const state = trackDaysFeature.reducer(
      undefined,
      trackDayCompleted({
        trackDay: {
          id: 8,
          userId: 1,
          trackId: 2,
          vehicleId: 1,
          startDate: '2026-09-03',
          endDate: '2026-09-04',
          notes: null,
          conditions: 'Dry',
        },
        sessions: [{ id: 5, trackDayId: 8, name: 'Practice', notes: null }],
        laps: { 5: [{ id: 11, sessionId: 5, lapNumber: 1, timeMillis: 90000 }] },
      }),
    );

    expect(state.completedTrackDayId).toBe(8);
    expect(state.trackDays[0].id).toBe(8);
    expect(state.laps[5][0].timeMillis).toBe(90000);
    expect(state.saving).toBe(false);
  });
});
