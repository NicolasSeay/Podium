import { createAction, createFeature, createReducer, on } from '@ngrx/store';

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthState {
  user: AuthUser | null;
}

export const authUserLoaded = createAction('[Auth] User Loaded', (user: AuthUser) => ({ user }));
export const authLoggedOut = createAction('[Auth] Logged Out');

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer<AuthState>(
    { user: null },
    on(authUserLoaded, (state, { user }) => ({ ...state, user })),
    on(authLoggedOut, () => ({ user: null })),
  ),
});
