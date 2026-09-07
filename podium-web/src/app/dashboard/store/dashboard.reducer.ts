import { Action, ActionReducer, createReducer, on } from '@ngrx/store';
import {
  dashboardLoadFailed,
  dashboardLoadRequested,
  dashboardLoaded,
  setActiveNav,
} from './dashboard.actions';
import { initialState } from './dashboard.store';
import { DashboardState } from './dashboard.models';

let reducer: ActionReducer<DashboardState> | undefined;

export const dashboardReducer: ActionReducer<DashboardState> = (
  state: DashboardState | undefined,
  action: Action,
) => {
  reducer ??= createReducer(
    initialState,
    on(setActiveNav, (state, { activeNav }) => ({ ...state, activeNav })),
    on(dashboardLoadRequested, (state) => ({ ...state, loading: true, error: null })),
    on(dashboardLoaded, (state, { data }) => ({ ...state, data, loading: false, error: null })),
    on(dashboardLoadFailed, (state, { error }) => ({ ...state, loading: false, error })),
  );
  return reducer(state, action);
};
