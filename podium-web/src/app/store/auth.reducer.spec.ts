import {
  authLoggedOut,
  authRehydrateFailed,
  authRehydrateRequested,
  authUserLoaded,
} from './auth.actions';
import { authFeature } from './auth.store';

describe('authReducer', () => {
  const user = {
    id: 1,
    email: 'driver@example.com',
    firstName: 'Nicolas',
    lastName: 'Seay',
  };

  it('initializes the authentication state', () => {
    expect(authFeature.reducer(undefined, { type: '@@init' })).toEqual({
      user: null,
      rehydrating: false,
    });
  });

  it('marks rehydration as pending', () => {
    expect(authFeature.reducer(undefined, authRehydrateRequested())).toMatchObject({
      rehydrating: true,
      user: null,
    });
  });

  it('stores the loaded user and clears the pending state', () => {
    expect(authFeature.reducer(undefined, authUserLoaded(user))).toEqual({
      user,
      rehydrating: false,
    });
  });

  it('clears the pending state when rehydration fails', () => {
    const state = { user, rehydrating: true };

    expect(authFeature.reducer(state, authRehydrateFailed())).toEqual({
      user,
      rehydrating: false,
    });
  });

  it('clears the user when logging out', () => {
    expect(authFeature.reducer({ user, rehydrating: true }, authLoggedOut())).toEqual({
      user: null,
      rehydrating: false,
    });
  });
});
