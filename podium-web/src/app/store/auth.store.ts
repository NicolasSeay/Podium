import { createFeature } from '@ngrx/store';
import { authReducer } from './auth.reducer';
import { AuthState } from './auth.models';

export const initialState: AuthState = {
  user: null,
  rehydrating: false,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: authReducer,
});
