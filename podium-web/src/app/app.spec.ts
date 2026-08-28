import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { Store } from '@ngrx/store';
import { App } from './app';
import { DashboardEffects } from './dashboard/dashboard.effects';
import { dashboardFeature, dashboardLoaded } from './dashboard/dashboard.store';
import { TracksEffects } from './tracks/tracks.effects';
import { tracksFeature } from './tracks/tracks.store';
import { authFeature, authUserLoaded } from './auth.store';
import { VehiclesEffects } from './vehicles/vehicles.effects';
import { vehiclesFeature } from './vehicles/vehicles.store';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideStore({
          [dashboardFeature.name]: dashboardFeature.reducer,
          [authFeature.name]: authFeature.reducer,
        }),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Dashboard');
  });

  it('renders dashboard metrics from loaded API data', () => {
    const fixture = TestBed.createComponent(App);
    TestBed.inject(Store).dispatch(
      dashboardLoaded({
        personalRecords: [
          {
            id: 1,
            userId: 1,
            lapId: 1,
            trackId: 1,
            vehicleId: 1,
            timeMillis: 158421,
          },
        ],
        totalTrackDays: 4,
        totalSessions: 7,
        totalLaps: 42,
        totalLapTimeMillis: 3600000,
        recentTrackDays: [],
      }),
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('2:38.421');
    expect(fixture.nativeElement.textContent).toContain('4');
    expect(fixture.nativeElement.textContent).toContain('42');
    expect(fixture.nativeElement.textContent).toContain('1h 0m');
  });

  it('renders the authenticated user name from the auth store', () => {
    const fixture = TestBed.createComponent(App);
    TestBed.inject(Store).dispatch(
      authUserLoaded({
        id: 1,
        email: 'nicolas@example.com',
        firstName: 'Nicolas',
        lastName: 'Seay',
      }),
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Welcome back, Nicolas');
    expect(fixture.nativeElement.textContent).toContain('Nicolas S.');
    expect(fixture.nativeElement.textContent).toContain('NS');
  });
});

describe('App track creation flow', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore({
          [dashboardFeature.name]: dashboardFeature.reducer,
          [tracksFeature.name]: tracksFeature.reducer,
          [vehiclesFeature.name]: vehiclesFeature.reducer,
        }),
        provideEffects(DashboardEffects, TracksEffects, VehiclesEffects),
      ],
    }).compileComponents();
  });

  it('posts a new track and renders the persisted response', () => {
    const fixture = TestBed.createComponent(App);
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('/api/dashboard').flush({
      personalRecords: [],
      totalTrackDays: 0,
      totalSessions: 0,
      totalLaps: 0,
      totalLapTimeMillis: 0,
      recentTrackDays: [],
    });
    fixture.detectChanges();

    (
      fixture.nativeElement.querySelector('button.nav-item:nth-of-type(5)') as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    http.expectOne('/api/tracks').flush([]);
    fixture.detectChanges();

    const name = fixture.nativeElement.querySelector('#track-name') as HTMLInputElement;
    const location = fixture.nativeElement.querySelector('#track-location') as HTMLInputElement;
    name.value = 'Road Atlanta';
    name.dispatchEvent(new Event('input'));
    location.value = 'Braselton, GA';
    location.dispatchEvent(new Event('input'));
    (fixture.nativeElement.querySelector('.track-form') as HTMLFormElement).dispatchEvent(
      new Event('submit'),
    );

    const request = http.expectOne('/api/tracks');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ name: 'Road Atlanta', location: 'Braselton, GA' });
    request.flush({
      id: 1,
      userId: 1,
      name: 'Road Atlanta',
      location: 'Braselton, GA',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Road Atlanta');
    expect(fixture.nativeElement.textContent).toContain('Braselton, GA');
  });

  it('posts a new vehicle and renders the persisted response', () => {
    const fixture = TestBed.createComponent(App);
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('/api/dashboard').flush({
      personalRecords: [],
      totalTrackDays: 0,
      totalSessions: 0,
      totalLaps: 0,
      totalLapTimeMillis: 0,
      recentTrackDays: [],
    });
    fixture.detectChanges();

    (
      fixture.nativeElement.querySelector('button.nav-item:nth-of-type(6)') as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    http.expectOne('/api/vehicles').flush([]);
    fixture.detectChanges();

    const name = fixture.nativeElement.querySelector('#vehicle-name') as HTMLInputElement;
    const make = fixture.nativeElement.querySelector('#vehicle-make') as HTMLInputElement;
    const model = fixture.nativeElement.querySelector('#vehicle-model') as HTMLInputElement;
    const year = fixture.nativeElement.querySelector('#vehicle-year') as HTMLInputElement;
    name.value = 'Sunday Driver';
    name.dispatchEvent(new Event('input'));
    make.value = 'Mazda';
    make.dispatchEvent(new Event('input'));
    model.value = 'MX-5 Miata';
    model.dispatchEvent(new Event('input'));
    year.value = '2020';
    year.dispatchEvent(new Event('input'));
    (fixture.nativeElement.querySelector('.vehicle-form') as HTMLFormElement).dispatchEvent(
      new Event('submit'),
    );

    const request = http.expectOne('/api/vehicles');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      name: 'Sunday Driver',
      make: 'Mazda',
      model: 'MX-5 Miata',
      year: 2020,
    });
    request.flush({
      id: 1,
      userId: 1,
      name: 'Sunday Driver',
      make: 'Mazda',
      model: 'MX-5 Miata',
      year: 2020,
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Sunday Driver');
    expect(fixture.nativeElement.textContent).toContain('Mazda · MX-5 Miata · 2020');
  });
});
