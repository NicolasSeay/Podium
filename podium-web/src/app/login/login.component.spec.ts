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

  it('shows the password requirement during registration', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance as unknown as { toggleMode: () => void };
    component.toggleMode();
    fixture.detectChanges();

    const passwordInput = fixture.nativeElement.querySelector('#password') as HTMLInputElement;
    expect(passwordInput.minLength).toBe(8);
    expect(fixture.nativeElement.textContent).toContain('Password must be at least 8 characters.');
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
    component.password = 'secret123';
    component.firstName = 'New';
    component.lastName = 'Driver';
    component.confirmPassword = 'secret123';
    component.submit();

    const request = http.expectOne('/api/auth/register');
    expect(request.request.body).toEqual({
      email: 'new-driver@example.com',
      password: 'secret123',
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
    expect(document.cookie).not.toContain('podium.user.id=');
    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(TestBed.inject(Store).selectSignal(authFeature.selectUser)()).toEqual({
      id: 1,
      email: 'driver@example.com',
      firstName: 'Nicolas',
      lastName: 'Seay',
    });
  });

  it('shows a sign-in failure and stops loading when the login request fails', () => {
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
    request.flush({}, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    expect(button.disabled).toBe(false);
    expect(button.textContent).toContain('Sign in');
    expect(button.textContent).not.toContain('Signing in...');
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'Sign in failed.',
    );
  });

  it('shows a registration failure and stops loading when the registration request fails', () => {
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
    component.password = 'secret123';
    component.firstName = 'New';
    component.lastName = 'Driver';
    component.confirmPassword = 'secret123';
    component.submit();

    const request = http.expectOne('/api/auth/register');
    request.flush({}, { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    expect(button.disabled).toBe(false);
    expect(button.textContent).toContain('Create account');
    expect(button.textContent).not.toContain('Creating account...');
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'Registration failed.',
    );
  });
});
