import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideStore, Store } from '@ngrx/store';
import { AuthEffects } from './auth.effects';
import { authFeature, authRehydrateRequested } from './auth.store';

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
    document.cookie = 'podium.user.id=1; Path=/; SameSite=Lax';
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
    document.cookie = 'podium.user.id=; Max-Age=0; Path=/; SameSite=Lax';
  });

  it('loads the current user when a token and user ID cookie exist', () => {
    TestBed.inject(Store).dispatch(authRehydrateRequested());

    const request = http.expectOne('/api/users/me');
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
  });
});
