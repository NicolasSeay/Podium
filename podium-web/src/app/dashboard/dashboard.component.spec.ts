import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngrx/store';
import { DashboardComponent } from './dashboard.component';
import {
  dashboardFeature,
  dashboardLoadFailed,
  dashboardLoaded,
  DashboardData,
} from './dashboard.store';
import { authFeature, authUserLoaded } from '../auth.store';
import { trackDaysFeature, trackDaysLoaded } from '../track-days/track-days.store';

const dashboardData: DashboardData = {
  personalRecords: [
    { id: 1, userId: 1, lapId: 1, trackId: 1, vehicleId: 1, timeMillis: 102350 },
    { id: 2, userId: 1, lapId: 2, trackId: 1, vehicleId: 1, timeMillis: 101900 },
  ],
  totalTrackDays: 3,
  totalSessions: 2,
  totalLaps: 4,
  totalLapTimeMillis: 3660000,
  recentTrackDays: [],
  analyticsSessions: [
    {
      sessionId: 2,
      trackDayId: 2,
      trackDayDate: '2026-09-03',
      vehicleId: 1,
      sessionName: 'Qualifying',
      laps: [
        { id: 3, sessionId: 2, lapNumber: 2, timeMillis: 102000 },
        { id: 4, sessionId: 2, lapNumber: 1, timeMillis: 100000 },
      ],
    },
    {
      sessionId: 1,
      trackDayId: 1,
      trackDayDate: '2026-08-01',
      vehicleId: null,
      sessionName: 'Practice',
      laps: [
        { id: 1, sessionId: 1, lapNumber: 1, timeMillis: 110000 },
        { id: 2, sessionId: 1, lapNumber: 2, timeMillis: 108000 },
      ],
    },
  ],
};

const trackDays = [
  {
    id: 1,
    userId: 1,
    trackId: 1,
    vehicleId: null,
    startDate: '2026-08-01',
    notes: null,
    conditions: null,
  },
  {
    id: 2,
    userId: 1,
    trackId: 2,
    vehicleId: 1,
    startDate: '2026-09-03',
    notes: null,
    conditions: null,
  },
];

const tracks = [
  { id: 1, name: 'North Circuit', city: 'Northport', country: 'US', lengthMiles: 2 },
  { id: 2, name: 'Summit Raceway', city: 'Summit', country: 'US', lengthMiles: 3 },
  { id: 3, name: 'Unused Track', city: 'Elsewhere', country: 'US', lengthMiles: 4 },
];

const vehicles = [{ id: 1, name: 'Track car', make: 'Example', model: 'GT', year: 2024 }];

describe('DashboardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideStore({
          [dashboardFeature.name]: dashboardFeature.reducer,
          [authFeature.name]: authFeature.reducer,
          [trackDaysFeature.name]: trackDaysFeature.reducer,
        }),
      ],
    }).compileComponents();
  });

  it('renders metrics and analytics from store data', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const store = TestBed.inject(Store);
    store.dispatch(
      authUserLoaded({
        id: 1,
        email: 'driver@example.com',
        firstName: 'Driver',
        lastName: 'Example',
      }),
    );
    store.dispatch(trackDaysLoaded({ tracks, vehicles, trackDays }));
    store.dispatch(dashboardLoaded(dashboardData));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Welcome back, Driver');
    expect(fixture.nativeElement.textContent).toContain('1:41.900');
    expect(fixture.nativeElement.textContent).toContain('1h 1m');
    expect(fixture.nativeElement.textContent).toContain('Practice');
    expect(fixture.nativeElement.textContent).toContain('Qualifying');
    expect(fixture.nativeElement.querySelectorAll('.range-column')).toHaveLength(2);
    expect(fixture.nativeElement.querySelectorAll('.histogram-column')).toHaveLength(5);
  });

  it('selects sessions and dispatches filter and retry actions', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const store = TestBed.inject(Store);
    const dispatch = vi.spyOn(store, 'dispatch');
    store.dispatch(trackDaysLoaded({ tracks, vehicles, trackDays }));
    store.dispatch(dashboardLoaded(dashboardData));
    fixture.detectChanges();

    const sessionButtons = fixture.nativeElement.querySelectorAll('.range-column');
    (sessionButtons[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.trace-panel h2').textContent).toContain(
      'Practice',
    );

    const trackSelect = fixture.nativeElement.querySelector(
      '[aria-label="Filter by track"]',
    ) as HTMLSelectElement;
    trackSelect.value = '1';
    trackSelect.dispatchEvent(new Event('change'));
    const vehicleSelect = fixture.nativeElement.querySelector(
      '[aria-label="Filter by vehicle"]',
    ) as HTMLSelectElement;
    vehicleSelect.value = '1';
    vehicleSelect.dispatchEvent(new Event('change'));
    (fixture.nativeElement.querySelector('.outline-button') as HTMLButtonElement)?.click();

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ trackId: 1 }));
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ vehicleId: 1 }));
  });

  it('renders loading, error, and empty analytics states', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    const store = TestBed.inject(Store);
    store.dispatch(dashboardLoadFailed('Dashboard unavailable'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain(
      'Dashboard unavailable',
    );

    store.dispatch(dashboardLoaded({ ...dashboardData, analyticsSessions: [] }));
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No lap data yet');
  });
});
