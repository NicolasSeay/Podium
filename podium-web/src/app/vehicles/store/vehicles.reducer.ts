import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import {
  vehicleCreateRequested,
  vehicleCreated,
  vehicleDeleteRequested,
  vehicleDeleted,
  vehiclesLoaded,
  vehiclesLoadRequested,
  vehiclesRequestFailed,
} from './vehicles.actions';
import { initialState } from './vehicles.store';
import { VehiclesState } from './vehicles.models';

let reducer: ActionReducer<VehiclesState> | undefined;

export const vehiclesReducer: ActionReducer<VehiclesState> = (
  state: VehiclesState | undefined,
  action: Action,
) => {
  reducer ??= createReducer(
    initialState,
    on(vehiclesLoadRequested, (state) => ({ ...state, loading: true, error: null })),
    on(vehiclesLoaded, (state, { vehicles }) => ({
      ...state,
      vehicles: vehicles ?? [],
      loading: false,
      error: null,
    })),
    on(vehicleCreateRequested, (state) => ({ ...state, saving: true, error: null })),
    on(vehicleCreated, (state, { vehicle }) => ({
      ...state,
      vehicles: [...(state.vehicles ?? []), vehicle],
      saving: false,
      error: null,
    })),
    on(vehicleDeleteRequested, (state) => ({
      ...state,
      saving: true,
      error: null,
    })),
    on(vehicleDeleted, (state, { id }) => ({
      ...state,
      vehicles: (state.vehicles ?? []).filter((vehicle) => vehicle.id !== id),
      saving: false,
      error: null,
    })),
    on(vehiclesRequestFailed, (state, { error }) => ({
      ...state,
      loading: false,
      saving: false,
      error,
    })),
  );
  return reducer(state, action);
};
