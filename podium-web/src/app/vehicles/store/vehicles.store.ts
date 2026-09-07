import { createFeature } from '@ngrx/store';
import { vehiclesReducer } from './vehicles.reducer';
import { VehiclesState } from './vehicles.models';

export const initialState: VehiclesState = {
  vehicles: undefined,
  loading: false,
  saving: false,
  error: null,
};

export const vehiclesFeature = createFeature({
  name: 'vehicles',
  reducer: vehiclesReducer,
});
