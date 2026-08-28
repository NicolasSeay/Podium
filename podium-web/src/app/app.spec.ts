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

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideStore({ [dashboardFeature.name]: dashboardFeature.reducer })],
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
            id: 'record-1',
            userId: 'user-1',
            lapId: 'lap-1',
            trackId: 'track-1',
            vehicleId: 'vehicle-1',
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
        }),
        provideEffects(DashboardEffects, TracksEffects),
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
      id: 'track-1',
      userId: 'user-1',
      name: 'Road Atlanta',
      location: 'Braselton, GA',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Road Atlanta');
    expect(fixture.nativeElement.textContent).toContain('Braselton, GA');
  });
});
