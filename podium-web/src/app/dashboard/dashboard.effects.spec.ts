import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { Observable, of, throwError } from 'rxjs';
import { DashboardApiService } from './dashboard-api.service';
import { DashboardEffects } from './dashboard.effects';
import {
  dashboardLoadFailed,
  dashboardLoadRequested,
  dashboardLoaded,
  DashboardData,
} from './dashboard.store';

describe('DashboardEffects', () => {
  let actions$: Observable<unknown>;
  let effects: DashboardEffects;
  let api: { getDashboard: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    api = { getDashboard: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        DashboardEffects,
        provideMockActions(() => actions$),
        { provide: DashboardApiService, useValue: api },
      ],
    });
    effects = TestBed.inject(DashboardEffects);
  });

  it('loads dashboard data', () => {
    const data = { totalTrackDays: 1 } as DashboardData;
    api.getDashboard.mockReturnValue(of(data));
    actions$ = of(dashboardLoadRequested());

    effects.loadDashboard$.subscribe((action) => expect(action).toEqual(dashboardLoaded(data)));
    expect(api.getDashboard).toHaveBeenCalledOnce();
  });

  it('converts API failures to a load failure action', () => {
    api.getDashboard.mockReturnValue(throwError(() => new Error('network unavailable')));
    actions$ = of(dashboardLoadRequested());

    effects.loadDashboard$.subscribe((action) =>
      expect(action).toEqual(dashboardLoadFailed('network unavailable')),
    );
  });
});
