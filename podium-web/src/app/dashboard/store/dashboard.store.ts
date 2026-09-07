import { createFeature } from '@ngrx/store';
import { dashboardReducer } from './dashboard.reducer';
import { DashboardState } from './dashboard.models';

export const initialState: DashboardState = {
  activeNav: 'Dashboard',
  data: null,
  loading: false,
  error: null,
};

export const dashboardFeature = createFeature({
  name: 'dashboard',
  reducer: dashboardReducer,
});
