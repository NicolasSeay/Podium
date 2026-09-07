import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { TrackDaysService } from '../track-days.service';
import { TrackDaysEffects } from './track-days.effects';
import {
  trackDayOptionsLoaded,
  trackDayOptionsLoadRequested,
  trackDaysLoadRequested,
  trackDaysLoaded,
} from './track-days.actions';

describe('TrackDaysEffects', () => {
  let actions$: Observable<unknown>;
  let effects: TrackDaysEffects;
  let api: {
    tracks: ReturnType<typeof vi.fn>;
    vehicles: ReturnType<typeof vi.fn>;
    list: ReturnType<typeof vi.fn>;
    stats: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    api = { tracks: vi.fn(), vehicles: vi.fn(), list: vi.fn(), stats: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        TrackDaysEffects,
        provideMockActions(() => actions$),
        { provide: TrackDaysService, useValue: api },
      ],
    });
    effects = TestBed.inject(TrackDaysEffects);
  });

  it('loads sessions and laps with each track-day aggregate', () => {
    const trackDay = {
      id: 7,
      userId: 1,
      trackId: 2,
      vehicleId: 3,
      startDate: '2026-09-04',
      notes: null,
      conditions: null,
    };
    const session = { id: 4, trackDayId: 7, name: 'Practice', notes: null };
    const laps = [{ id: 11, sessionId: 4, lapNumber: 1, timeMillis: 92350 }];
    api.tracks.mockReturnValue(of([]));
    api.vehicles.mockReturnValue(of([]));
    api.stats.mockReturnValue(of([]));
    api.list.mockReturnValue(of([{ trackDay, sessions: [session], laps: { 4: laps } }]));
    actions$ = of(trackDaysLoadRequested());

    let received: unknown;
    effects.load$.subscribe((action) => (received = action));

    expect(received).toEqual(
      trackDaysLoaded({
        tracks: [],
        vehicles: [],
        trackDays: [trackDay],
        sessions: [session],
        laps: { 4: laps },
        stats: [],
      }),
    );
  });

  it('loads only tracks and vehicles for option lists', () => {
    const tracks = [
      { id: 2, name: 'Road Atlanta', city: 'Braselton', country: 'US', lengthMiles: 2.54 },
    ];
    const vehicles = [{ id: 3, name: 'MX-5', make: 'Mazda', model: 'Miata', year: 2020 }];
    api.tracks.mockReturnValue(of(tracks));
    api.vehicles.mockReturnValue(of(vehicles));
    actions$ = of(trackDayOptionsLoadRequested());

    let received: unknown;
    effects.loadOptions$.subscribe((action) => (received = action));

    expect(api.list).not.toHaveBeenCalled();
    expect(api.stats).not.toHaveBeenCalled();
    expect(received).toEqual(trackDayOptionsLoaded({ tracks, vehicles }));
  });
});
