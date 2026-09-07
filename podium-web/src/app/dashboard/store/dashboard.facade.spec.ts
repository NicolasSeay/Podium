import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngrx/store';
import { DashboardFacade } from './dashboard.facade';
import { dashboardFeature } from './dashboard.store';

describe('DashboardFacade', () => {
  let facade: DashboardFacade;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideStore({ [dashboardFeature.name]: dashboardFeature.reducer }),
        DashboardFacade,
      ],
    });
    facade = TestBed.inject(DashboardFacade);
    store = TestBed.inject(Store);
  });

  it('dispatches dashboard loads with filters', () => {
    const dispatch = vi.spyOn(store, 'dispatch');

    facade.load(2, 3);

    expect(dispatch).toHaveBeenCalledWith({
      type: '[Dashboard] Load Requested',
      trackId: 2,
      vehicleId: 3,
    });
  });

  it('updates active navigation through the store', () => {
    facade.setActiveNavigation('Tracks');

    expect(facade.activeNav()).toBe('Tracks');
  });
});
