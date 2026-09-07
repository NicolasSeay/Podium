import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import {
  authLoggedOut,
  authRehydrateFailed,
  authRehydrateRequested,
  authUserLoaded,
} from './auth.actions';
import { initialState } from './auth.store';
import { AuthState } from './auth.models';

let reducer: ActionReducer<AuthState> | undefined;

export const authReducer: ActionReducer<AuthState> = (
  state: AuthState | undefined,
  action: Action,
) => {
  reducer ??= createReducer(
    initialState,
    on(authRehydrateRequested, (state) => ({ ...state, rehydrating: true })),
    on(authUserLoaded, (state, { user }) => ({ ...state, user, rehydrating: false })),
    on(authRehydrateFailed, (state) => ({ ...state, rehydrating: false })),
    on(authLoggedOut, () => ({ user: null, rehydrating: false })),
  );
  return reducer(state, action);
};
