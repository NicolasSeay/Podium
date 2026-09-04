import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { VehiclesApiService } from './vehicles-api.service';

describe('VehiclesApiService', () => {
  let service: VehiclesApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VehiclesApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(VehiclesApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lists vehicles', () => {
    service.list().subscribe();

    const request = http.expectOne('/api/vehicles');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('creates a vehicle', () => {
    const vehicle = {
      name: 'Track car',
      make: 'Example',
      model: 'GT',
      trim: null,
      year: 2024,
    };
    service.create(vehicle).subscribe();

    const request = http.expectOne('/api/vehicles');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(vehicle);
    request.flush({});
  });

  it('deletes a vehicle', () => {
    service.delete(8).subscribe();

    const request = http.expectOne('/api/vehicles/8');
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
