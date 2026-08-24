import { createAction, createFeature, createReducer, on } from '@ngrx/store';

export type DashboardRange = 'Last 12 Months' | 'Last 6 Months' | 'This Year';

export interface DashboardState {
  range: DashboardRange;
  activeNav: string;
}

export const setRange = createAction('[Dashboard] Set Range', (range: DashboardRange) => ({ range }));
export const setActiveNav = createAction('[Dashboard] Set Active Navigation', (activeNav: string) => ({ activeNav }));

const initialState: DashboardState = {
  range: 'Last 12 Months',
  activeNav: 'Dashboard',
};

export const dashboardFeature = createFeature({
  name: 'dashboard',
  reducer: createReducer(
    initialState,
    on(setRange, (state, { range }) => ({ ...state, range })),
    on(setActiveNav, (state, { activeNav }) => ({ ...state, activeNav })),
  ),
});
