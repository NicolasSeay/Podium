import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
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
    storage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    storage.clear();
  });

  it('adds the stored token as a bearer header', () => {
    storage.set('podium.auth.token', 'session-token');
    TestBed.inject(HttpClient).get('/api/dashboard').subscribe();

    const request = http.expectOne('/api/dashboard');
    expect(request.request.headers.get('Authorization')).toBe('Bearer session-token');
    request.flush({});
  });

  it('clears the session and redirects after a 401', () => {
    storage.set('podium.auth.token', 'expired-token');
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    TestBed.inject(HttpClient)
      .get('/api/dashboard')
      .subscribe({ error: () => undefined });

    http.expectOne('/api/dashboard').flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(storage.get('podium.auth.token')).toBeUndefined();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
