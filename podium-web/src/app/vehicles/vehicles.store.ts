import { createAction, createFeature, createReducer, on } from '@ngrx/store';

export interface Vehicle {
  id: number;
  userId: number;
  name: string;
  make: string | null;
  model: string | null;
  year: number | null;
}

export interface VehiclesState {
  vehicles: Vehicle[];
  loading: boolean;
  saving: boolean;
  error: string | null;
}

export const vehiclesLoadRequested = createAction('[Vehicles] Load Requested');
export const vehiclesLoaded = createAction('[Vehicles] Loaded', (vehicles: Vehicle[]) => ({
  vehicles,
}));
export const vehicleCreateRequested = createAction(
  '[Vehicles] Create Requested',
  (vehicle: { name: string; make: string | null; model: string | null; year: number | null }) => ({
    vehicle,
  }),
);
export const vehicleCreated = createAction('[Vehicles] Created', (vehicle: Vehicle) => ({
  vehicle,
}));
export const vehiclesRequestFailed = createAction('[Vehicles] Request Failed', (error: string) => ({
  error,
}));

const initialState: VehiclesState = {
  vehicles: [],
  loading: false,
  saving: false,
  error: null,
};

export const vehiclesFeature = createFeature({
  name: 'vehicles',
  reducer: createReducer(
    initialState,
    on(vehiclesLoadRequested, (state) => ({ ...state, loading: true, error: null })),
    on(vehiclesLoaded, (state, { vehicles }) => ({
      ...state,
      vehicles,
      loading: false,
      error: null,
    })),
    on(vehicleCreateRequested, (state) => ({ ...state, saving: true, error: null })),
    on(vehicleCreated, (state, { vehicle }) => ({
      ...state,
      vehicles: [...state.vehicles, vehicle],
      saving: false,
      error: null,
    })),
    on(vehiclesRequestFailed, (state, { error }) => ({
      ...state,
      loading: false,
      saving: false,
      error,
    })),
  ),
});
