import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { DashboardData } from './store/dashboard.models';

describe('DashboardService', () => {
  let service: DashboardService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DashboardService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('requests the dashboard endpoint', () => {
    const data: DashboardData = {
      totalTrackDays: 1,
      totalSessions: 0,
      totalLaps: 0,
      totalLapTimeMillis: 0,
      recentTrackDays: [],
      analyticsSessions: [],
    };
    service.getDashboard().subscribe((result) => expect(result).toEqual(data));

    const request = http.expectOne('/api/dashboard');
    expect(request.request.method).toBe('GET');
    request.flush(data);
  });

  it('sends track and vehicle filters', () => {
    service.getDashboard(10, 20).subscribe();

    const request = http.expectOne('/api/dashboard?trackId=10&vehicleId=20');
    expect(request.request.method).toBe('GET');
    request.flush({
      totalTrackDays: 0,
      totalSessions: 0,
      totalLaps: 0,
      totalLapTimeMillis: 0,
      recentTrackDays: [],
      analyticsSessions: [],
    });
  });
});
