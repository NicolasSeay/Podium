import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngrx/store';
import { AnalyticsComponent } from './analytics.component';
import { dashboardFeature } from '../dashboard/store/dashboard.store';
import { dashboardLoaded } from '../dashboard/store/dashboard.actions';
import { DashboardData } from '../dashboard/store/dashboard.models';

const data: DashboardData = {
  totalTrackDays: 1,
  totalSessions: 1,
  totalLaps: 2,
  totalLapTimeMillis: 200000,
  recentTrackDays: [],
  analyticsSessions: [
    {
      sessionId: 1,
      trackDayId: 1,
      trackDayDate: '2026-09-03',
      vehicleId: 1,
      sessionName: 'Practice',
      laps: [
        { id: 1, sessionId: 1, lapNumber: 1, timeMillis: 100000 },
        { id: 2, sessionId: 1, lapNumber: 2, timeMillis: 101000 },
      ],
    },
  ],
};

describe('AnalyticsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsComponent],
      providers: [provideStore({ [dashboardFeature.name]: dashboardFeature.reducer })],
    }).compileComponents();
  });

  it('renders all analytics charts and session detail', () => {
    const fixture = TestBed.createComponent(AnalyticsComponent);
    TestBed.inject(Store).dispatch(dashboardLoaded(data));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Practice');
    expect(fixture.nativeElement.querySelectorAll('canvas')).toHaveLength(4);
    expect(fixture.nativeElement.querySelector('table')).not.toBeNull();
  });

  it('changes the selected trace when a session row is clicked', () => {
    const fixture = TestBed.createComponent(AnalyticsComponent);
    TestBed.inject(Store).dispatch(dashboardLoaded(data));
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('tbody tr') as HTMLTableRowElement).click();
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('tbody tr')?.classList.contains('selected-row'),
    ).toBe(true);
  });
});
