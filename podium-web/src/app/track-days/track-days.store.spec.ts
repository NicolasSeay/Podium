import {
  lapCreated,
  sessionCreated,
  trackDayCompleted,
  trackDayCreated,
  trackDaysFeature,
} from './track-days.store';

describe('trackDaysFeature', () => {
  it('stores a created day and selects it', () => {
    const state = trackDaysFeature.reducer(
      undefined,
      trackDayCreated({
        id: 7,
        userId: 1,
        trackId: 2,
        vehicleId: 1,
        startDate: '2026-09-03',
        notes: null,
        conditions: 'Dry',
      }),
    );

    expect(state.trackDays[0].id).toBe(7);
    expect(state.selectedDayId).toBe(7);
    expect(state.saving).toBe(false);
  });

  it('keeps sessions and laps grouped by session', () => {
    const withSession = trackDaysFeature.reducer(
      undefined,
      sessionCreated({ id: 4, trackDayId: 7, name: 'Practice', notes: null }),
    );
    const state = trackDaysFeature.reducer(
      withSession,
      lapCreated({ id: 9, sessionId: 4, lapNumber: 1, timeMillis: 92350 }),
    );

    expect(state.sessions[0].name).toBe('Practice');
    expect(state.laps[4]).toEqual([{ id: 9, sessionId: 4, lapNumber: 1, timeMillis: 92350 }]);
  });

  it('stores a completed multi-session track day as one domain update', () => {
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
