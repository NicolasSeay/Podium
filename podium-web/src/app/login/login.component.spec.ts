import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideStore, Store } from '@ngrx/store';
import { LoginComponent } from './login.component';
import { authFeature } from '../auth.store';

describe('LoginComponent', () => {
  let http: HttpTestingController;
  const storage = new Map<string, string>();

  beforeEach(async () => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        clear: () => storage.clear(),
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
      },
    });
    storage.clear();
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideStore({ [authFeature.name]: authFeature.reducer }),
      ],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    storage.clear();
  });

  it('prefills the demo credentials outside production', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance as unknown as {
      email: string;
      password: string;
    };

    expect(component.email).toBe('nicolas.seay@gmail.com');
    expect(component.password).toBe('password');
  });

  it('registers a new account and routes to the dashboard', () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance as unknown as {
      registering: boolean;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      confirmPassword: string;
      toggleMode: () => void;
      submit: () => void;
    };
    component.toggleMode();
    component.email = 'new-driver@example.com';
    component.password = 'secret';
    component.firstName = 'New';
    component.lastName = 'Driver';
    component.confirmPassword = 'secret';
    component.submit();

    const request = http.expectOne('/api/auth/register');
    expect(request.request.body).toEqual({
      email: 'new-driver@example.com',
      password: 'secret',
      firstName: 'New',
      lastName: 'Driver',
    });
    request.flush({
      token: 'registration-token',
      user: {
        id: 2,
        email: 'new-driver@example.com',
        firstName: 'New',
        lastName: 'Driver',
      },
    });

    expect(localStorage.getItem('podium.auth.token')).toBe('registration-token');
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('logs in and routes to the dashboard', () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance as unknown as {
      email: string;
      password: string;
      submit: () => void;
    };
    component.email = 'driver@example.com';
    component.password = 'secret';
    component.submit();

    const request = http.expectOne('/api/auth/login');
    expect(request.request.body).toEqual({ email: 'driver@example.com', password: 'secret' });
    request.flush({
      token: 'session-token',
      user: {
        id: 1,
        email: 'driver@example.com',
        firstName: 'Nicolas',
        lastName: 'Seay',
      },
    });

    expect(localStorage.getItem('podium.auth.token')).toBe('session-token');
    expect(document.cookie).toContain('podium.user.id=1');
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(TestBed.inject(Store).selectSignal(authFeature.selectUser)()).toEqual({
      id: 1,
      email: 'driver@example.com',
      firstName: 'Nicolas',
      lastName: 'Seay',
    });
  });
});
