import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../environments/environment';
import { apiUrlInterceptor } from './api-url.interceptor';

describe('apiUrlInterceptor', () => {
  let http: HttpTestingController;
  const originalApiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiUrlInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    environment.apiUrl = originalApiUrl;
    http.verify();
  });

  it('prefixes API requests when an API URL is configured', () => {
    environment.apiUrl = 'https://api.example.test';
    TestBed.inject(HttpClient).get('/api/dashboard').subscribe();

    const request = http.expectOne('https://api.example.test/api/dashboard');
    request.flush({});
  });

  it('leaves requests unchanged when they are not API requests', () => {
    environment.apiUrl = 'https://api.example.test';
    TestBed.inject(HttpClient).get('/assets/logo.svg').subscribe();

    const request = http.expectOne('/assets/logo.svg');
    request.flush({});
  });

  it('leaves API requests unchanged when no API URL is configured', () => {
    TestBed.inject(HttpClient).get('/api/dashboard').subscribe();

    const request = http.expectOne('/api/dashboard');
    request.flush({});
  });
});
