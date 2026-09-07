import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngrx/store';
import { trackDaysFeature } from './track-days.store';
import { TrackDaysFacade } from './track-days.facade';

describe('TrackDaysFacade', () => {
  let facade: TrackDaysFacade;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideStore({ [trackDaysFeature.name]: trackDaysFeature.reducer }),
        TrackDaysFacade,
      ],
    });
    facade = TestBed.inject(TrackDaysFacade);
    store = TestBed.inject(Store);
  });

  it('falls back to empty option collections', () => {
    expect(facade.tracks()).toEqual([]);
    expect(facade.vehicles()).toEqual([]);
  });

  it('loads options only while either collection is untouched', () => {
    const dispatch = vi.spyOn(store, 'dispatch');

    facade.loadOptions();
    expect(dispatch).toHaveBeenCalledWith({ type: '[Track Days] Options Load Requested' });

    store.dispatch({
      type: '[Track Days] Options Loaded',
      tracks: [],
      vehicles: [],
    });
    dispatch.mockClear();
    facade.loadOptions();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('dispatches load, selection, and completion commands', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    const trackDay = {
      id: 8,
      userId: 1,
      trackId: 2,
      vehicleId: 3,
      startDate: '2026-09-04',
      notes: null,
      conditions: null,
    };
    const payload = {
      trackId: 2,
      vehicleId: 3,
      startDate: '2026-09-04',
      endDate: '2026-09-04',
      notes: null,
      conditions: null,
      sessions: [],
    };

    facade.load();
    facade.selectDay(trackDay);
    facade.complete(payload);

    expect(
      dispatch.mock.calls.map(([action]) => (action as unknown as { type: string }).type),
    ).toEqual([
      '[Track Days] Load Requested',
      '[Track Days] Selected',
      '[Track Days] Complete Requested',
    ]);
  });
});
