import { createAction, createFeature, createReducer, on } from '@ngrx/store';
import { DistanceUnit, TemperatureUnit } from './preferences';

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  distanceUnit?: DistanceUnit;
  temperatureUnit?: TemperatureUnit;
  defaultTrackId?: number | null;
  defaultVehicleId?: number | null;
}

export interface AuthState {
  user: AuthUser | null;
  rehydrating: boolean;
}

export const authUserLoaded = createAction('[Auth] User Loaded', (user: AuthUser) => ({ user }));
export const authLoggedOut = createAction('[Auth] Logged Out');
export const authRehydrateRequested = createAction('[Auth] Rehydrate Requested');
export const authRehydrateFailed = createAction('[Auth] Rehydrate Failed');

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer<AuthState>(
    { user: null, rehydrating: false },
    on(authRehydrateRequested, (state) => ({ ...state, rehydrating: true })),
    on(authUserLoaded, (state, { user }) => ({ ...state, user, rehydrating: false })),
    on(authRehydrateFailed, (state) => ({ ...state, rehydrating: false })),
    on(authLoggedOut, () => ({ user: null, rehydrating: false })),
  ),
});
