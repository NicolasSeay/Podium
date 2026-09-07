import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideStore, Store } from '@ngrx/store';
import { AuthEffects } from './auth.effects';
import { authRehydrateRequested } from './auth.actions';
import { authFeature } from './auth.store';

describe('AuthEffects', () => {
  let http: HttpTestingController;
  const storage = new Map<string, string>();

  beforeEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        removeItem: (key: string) => storage.delete(key),
        setItem: (key: string, value: string) => storage.set(key, value),
      },
    });
    storage.set('podium.auth.token', 'session-token');
    storage.set('podium.auth.user-id', '1');
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore({ [authFeature.name]: authFeature.reducer }),
        provideEffects(AuthEffects),
      ],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    storage.clear();
  });

  it('loads the current user when a token exists', () => {
    TestBed.inject(Store).dispatch(authRehydrateRequested());
    expect(TestBed.inject(Store).selectSignal(authFeature.selectRehydrating)()).toBe(true);

    const request = http.expectOne('/api/users/1');
    expect(request.request.method).toBe('GET');
    request.flush({
      id: 1,
      email: 'driver@example.com',
      firstName: 'Nicolas',
      lastName: 'Seay',
    });

    expect(TestBed.inject(Store).selectSignal(authFeature.selectUser)()).toEqual({
      id: 1,
      email: 'driver@example.com',
      firstName: 'Nicolas',
      lastName: 'Seay',
    });
    expect(TestBed.inject(Store).selectSignal(authFeature.selectRehydrating)()).toBe(false);
  });
});
