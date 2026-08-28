import { TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { Store } from '@ngrx/store';
import { App } from './app';
import { dashboardFeature, dashboardLoaded } from './dashboard/dashboard.store';

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
