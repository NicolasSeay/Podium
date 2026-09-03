import { lapCreated, sessionCreated, trackDayCreated, trackDaysFeature } from './track-days.store';

describe('trackDaysFeature', () => {
  it('stores a created day and selects it', () => {
    const state = trackDaysFeature.reducer(
      undefined,
      trackDayCreated({
        id: 7,
        userId: 1,
        trackId: 2,
        vehicleId: null,
        date: '2026-09-03',
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
});
