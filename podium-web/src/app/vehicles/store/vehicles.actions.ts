import { createAction } from '@ngrx/store';
import { Vehicle } from './vehicles.models';

export const vehiclesLoadRequested = createAction('[Vehicles] Load Requested');
export const vehiclesLoaded = createAction('[Vehicles] Loaded', (vehicles: Vehicle[] | null) => ({
  vehicles,
}));
export const vehicleCreateRequested = createAction(
  '[Vehicles] Create Requested',
  (vehicle: {
    name: string;
    make: string | null;
    model: string | null;
    trim: string | null;
    year: number | null;
  }) => ({
    vehicle,
  }),
);
export const vehicleCreated = createAction('[Vehicles] Created', (vehicle: Vehicle) => ({
  vehicle,
}));
export const vehicleDeleteRequested = createAction('[Vehicles] Delete Requested', (id: number) => ({
  id,
}));
export const vehicleDeleted = createAction('[Vehicles] Deleted', (id: number) => ({
  id,
}));
export const vehiclesRequestFailed = createAction('[Vehicles] Request Failed', (error: string) => ({
  error,
}));
