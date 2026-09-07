import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TrackDaysApiService } from './track-days-api.service';

describe('TrackDaysApiService', () => {
  let service: TrackDaysApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackDaysApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TrackDaysApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('requests collection and lookup endpoints', () => {
    service.list().subscribe();
    service.stats().subscribe();
    service.tracks().subscribe();
    service.vehicles().subscribe();

    expect(http.expectOne('/api/track-days').request.method).toBe('GET');
    expect(http.expectOne('/api/track-days/stats').request.method).toBe('GET');
    expect(http.expectOne('/api/tracks').request.method).toBe('GET');
    expect(http.expectOne('/api/vehicles').request.method).toBe('GET');
    http.match(() => true).forEach((request) => request.flush([]));
  });

  it('creates a complete track day with nested sessions and laps', () => {
    const createPayload = {
      trackId: 1,
      vehicleId: 2,
      startDate: '2026-09-04',
      endDate: '2026-09-04',
      notes: 'dry day',
      conditions: 'dry',
      sessions: [],
    };

    service.create(createPayload).subscribe();

    const createRequest = http.expectOne('/api/track-days');
    expect(createRequest.request.method).toBe('POST');
    expect(createRequest.request.body).toEqual(createPayload);
    createRequest.flush({});
  });
});
