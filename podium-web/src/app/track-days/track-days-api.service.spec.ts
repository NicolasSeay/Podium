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

  it('creates and completes track days', () => {
    const createPayload = {
      trackId: 1,
      vehicleId: 2,
      startDate: '2026-09-04',
      notes: 'dry day',
      conditions: 'dry',
    };
    const completePayload = {
      ...createPayload,
      endDate: '2026-09-04',
      sessions: [],
    };

    service.create(createPayload).subscribe();
    service.complete(completePayload).subscribe();

    const createRequest = http.expectOne('/api/track-days');
    expect(createRequest.request.method).toBe('POST');
    expect(createRequest.request.body).toEqual(createPayload);
    createRequest.flush({});

    const completeRequest = http.expectOne('/api/track-days/complete');
    expect(completeRequest.request.method).toBe('POST');
    expect(completeRequest.request.body).toEqual(completePayload);
    completeRequest.flush({});
  });

  it('requests and creates sessions and laps', () => {
    const sessionPayload = { name: 'Session 1', notes: null };
    const lapPayload = { lapNumber: 1, timeMillis: 90000 };

    service.sessions(3).subscribe();
    service.createSession(3, sessionPayload).subscribe();
    service.laps(4).subscribe();
    service.createLap(4, lapPayload).subscribe();

    const sessionsRequest = http.expectOne({ method: 'GET', url: '/api/track-days/3/sessions' });
    sessionsRequest.flush([]);
    const createSessionRequest = http.expectOne({
      method: 'POST',
      url: '/api/track-days/3/sessions',
    });
    expect(createSessionRequest.request.body).toEqual(sessionPayload);
    createSessionRequest.flush({});
    const lapsRequest = http.expectOne({ method: 'GET', url: '/api/sessions/4/laps' });
    lapsRequest.flush([]);
    const createLapRequest = http.expectOne({ method: 'POST', url: '/api/sessions/4/laps' });
    expect(createLapRequest.request.body).toEqual(lapPayload);
    createLapRequest.flush({});
    http.match(() => true).forEach((request) => request.flush([]));
  });
});
