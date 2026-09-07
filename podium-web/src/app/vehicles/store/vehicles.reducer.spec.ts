import {
  vehicleCreateRequested,
  vehicleCreated,
  vehicleDeleteRequested,
  vehicleDeleted,
  vehiclesLoaded,
  vehiclesLoadRequested,
  vehiclesRequestFailed,
} from './vehicles.actions';
import { vehiclesFeature } from './vehicles.store';

describe('vehiclesReducer', () => {
  const vehicle = {
    id: 1,
    userId: 1,
    name: 'Sunday Driver',
    make: 'Mazda',
    model: 'MX-5 Miata',
    trim: 'Club',
    year: 2020,
  };
  const createRequest = {
    name: vehicle.name,
    make: vehicle.make,
    model: vehicle.model,
    trim: vehicle.trim,
    year: vehicle.year,
  };

  it('initializes with no loaded vehicles', () => {
    expect(vehiclesFeature.reducer(undefined, { type: '@@init' })).toEqual({
      vehicles: undefined,
      loading: false,
      saving: false,
      error: null,
    });
  });

  it('tracks a load request and normalizes a null response', () => {
    const loading = vehiclesFeature.reducer(undefined, vehiclesLoadRequested());

    expect(loading).toMatchObject({ loading: true, error: null });
    expect(vehiclesFeature.reducer(loading, vehiclesLoaded(null))).toMatchObject({
      vehicles: [],
      loading: false,
      error: null,
    });
  });

  it('stores loaded vehicles', () => {
    expect(vehiclesFeature.reducer(undefined, vehiclesLoaded([vehicle]))).toMatchObject({
      vehicles: [vehicle],
      loading: false,
      error: null,
    });
  });

  it('tracks vehicle creation and appends the created vehicle', () => {
    const saving = vehiclesFeature.reducer(undefined, vehicleCreateRequested(createRequest));

    expect(saving).toMatchObject({ saving: true, error: null });
    expect(vehiclesFeature.reducer(saving, vehicleCreated(vehicle))).toMatchObject({
      vehicles: [vehicle],
      saving: false,
      error: null,
    });
  });

  it('tracks deletion and removes only the requested vehicle', () => {
    const state = vehiclesFeature.reducer(
      {
        vehicles: [vehicle, { ...vehicle, id: 2, name: 'Rainy Day' }],
        loading: false,
        saving: false,
        error: null,
      },
      vehicleDeleteRequested(1),
    );

    expect(state).toMatchObject({ saving: true, error: null });
    expect(vehiclesFeature.reducer(state, vehicleDeleted(1)).vehicles).toEqual([
      { ...vehicle, id: 2, name: 'Rainy Day' },
    ]);
  });

  it('stores request failures and clears both pending flags', () => {
    expect(
      vehiclesFeature.reducer(
        { vehicles: [], loading: true, saving: true, error: null },
        vehiclesRequestFailed('Unable to load vehicles'),
      ),
    ).toEqual({
      vehicles: [],
      loading: false,
      saving: false,
      error: 'Unable to load vehicles',
    });
  });
});
