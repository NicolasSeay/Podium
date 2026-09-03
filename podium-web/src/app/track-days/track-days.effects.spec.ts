import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { TrackDaysApiService } from './track-days-api.service';
import { TrackDaysEffects } from './track-days.effects';
import { lapsLoaded, sessionsLoaded } from './track-days.store';

describe('TrackDaysEffects', () => {
  let actions$: Observable<unknown>;
  let effects: TrackDaysEffects;
  let api: { laps: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    api = { laps: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        TrackDaysEffects,
        provideMockActions(() => actions$),
        { provide: TrackDaysApiService, useValue: api },
      ],
    });
    effects = TestBed.inject(TrackDaysEffects);
  });

  it('loads laps for sessions returned when opening a recorded track day', () => {
    const firstLap = { id: 11, sessionId: 4, lapNumber: 1, timeMillis: 92350 };
    const secondLap = { id: 12, sessionId: 5, lapNumber: 1, timeMillis: 90100 };
    api.laps.mockImplementation((sessionId: number) =>
      of(sessionId === 4 ? [firstLap] : [secondLap]),
    );
    actions$ = of(
      sessionsLoaded([
        { id: 4, trackDayId: 7, name: 'Practice', notes: null },
        { id: 5, trackDayId: 7, name: 'Qualifying', notes: null },
      ]),
    );

    const received: unknown[] = [];
    effects.loadLapsForSessions$.subscribe((action) => received.push(action));

    expect(received).toEqual([lapsLoaded(4, [firstLap]), lapsLoaded(5, [secondLap])]);
    expect(api.laps).toHaveBeenNthCalledWith(1, 4);
    expect(api.laps).toHaveBeenNthCalledWith(2, 5);
  });
});
