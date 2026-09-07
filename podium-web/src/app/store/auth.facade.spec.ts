import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngrx/store';
import { authFeature } from './auth.store';
import { AuthFacade } from './auth.facade';

describe('AuthFacade', () => {
  let facade: AuthFacade;
  let store: Store;
  const user = {
    id: 1,
    email: 'driver@example.com',
    firstName: 'Nicolas',
    lastName: 'Seay',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore({ [authFeature.name]: authFeature.reducer }), AuthFacade],
    });
    facade = TestBed.inject(AuthFacade);
    store = TestBed.inject(Store);
  });

  it('dispatches rehydration and logout requests', () => {
    const dispatch = vi.spyOn(store, 'dispatch');

    facade.rehydrate();
    facade.loggedOut();

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect((dispatch.mock.calls[0][0] as unknown as { type: string }).type).toBe(
      '[Auth] Rehydrate Requested',
    );
    expect((dispatch.mock.calls[1][0] as unknown as { type: string }).type).toBe(
      '[Auth] Logged Out',
    );
  });

  it('dispatches a loaded user and formats identity values', () => {
    facade.userLoaded(user);

    expect(facade.user()).toEqual(user);
    expect(facade.userName()).toBe('Nicolas S.');
    expect(facade.initials()).toBe('NS');
  });

  it('uses driver fallbacks when no user is loaded', () => {
    expect(facade.userName()).toBe('Driver');
    expect(facade.initials()).toBe('D');
  });
});
