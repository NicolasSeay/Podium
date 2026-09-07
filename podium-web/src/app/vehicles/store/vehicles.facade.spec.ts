import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngrx/store';
import { VehiclesFacade } from './vehicles.facade';
import { vehiclesFeature } from './vehicles.store';

describe('VehiclesFacade', () => {
  let facade: VehiclesFacade;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideStore({ [vehiclesFeature.name]: vehiclesFeature.reducer }),
        VehiclesFacade,
      ],
    });
    facade = TestBed.inject(VehiclesFacade);
    store = TestBed.inject(Store);
  });

  it('falls back to an empty vehicle collection', () => {
    expect(facade.vehicles()).toEqual([]);
  });

  it('dispatches vehicle load, create, and delete commands', () => {
    const dispatch = vi.spyOn(store, 'dispatch');
    const vehicle = {
      name: 'Sunday Driver',
      make: 'Mazda',
      model: 'MX-5 Miata',
      trim: 'Club',
      year: 2020,
    };

    facade.load();
    facade.create(vehicle);
    facade.delete(4);

    expect(dispatch.mock.calls.map(([action]) => action)).toEqual([
      { type: '[Vehicles] Load Requested' },
      { type: '[Vehicles] Create Requested', vehicle },
      { type: '[Vehicles] Delete Requested', id: 4 },
    ]);
  });
});
