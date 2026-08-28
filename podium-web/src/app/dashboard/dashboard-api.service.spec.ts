import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DashboardApiService } from './dashboard-api.service';
import { DashboardData } from './dashboard.store';

describe('DashboardApiService', () => {
  let service: DashboardApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DashboardApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('requests the dashboard endpoint', () => {
    const data = { totalTrackDays: 1 } as DashboardData;
    service.getDashboard().subscribe((result) => expect(result).toEqual(data));

    const request = http.expectOne('/api/dashboard');
    expect(request.request.method).toBe('GET');
    request.flush(data);
  });
});
