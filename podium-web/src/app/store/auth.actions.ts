import { createAction } from '@ngrx/store';
import { AuthUser } from './auth.models';

export const authUserLoaded = createAction('[Auth] User Loaded', (user: AuthUser) => ({ user }));
export const authLoggedOut = createAction('[Auth] Logged Out');
export const authRehydrateRequested = createAction('[Auth] Rehydrate Requested');
export const authRehydrateFailed = createAction('[Auth] Rehydrate Failed');
