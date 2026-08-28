import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { App } from '../app';
import { DashboardEffects } from '../dashboard/dashboard.effects';
import { dashboardFeature } from '../dashboard/dashboard.store';
import { authFeature } from '../auth.store';
import { AppPage } from '../testing/app-page';
import { flushDashboardRequest } from '../testing/http-test-data';
import { TracksEffects } from './tracks.effects';
import { tracksFeature } from './tracks.store';

describe('Tracks page integration', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore({
          [dashboardFeature.name]: dashboardFeature.reducer,
          [authFeature.name]: authFeature.reducer,
          [tracksFeature.name]: tracksFeature.reducer,
        }),
        provideEffects(DashboardEffects, TracksEffects),
      ],
    }).compileComponents();
  });

  it('loads saved tracks after navigating to the page', () => {
    const fixture = TestBed.createComponent(App);
    const page = new AppPage(fixture);
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    flushDashboardRequest(http);
    fixture.detectChanges();

    page.clickNavigation('Tracks');
    http
      .expectOne('/api/tracks')
      .flush([{ id: 1, userId: 1, name: 'Road Atlanta', location: 'Braselton, GA' }]);
    fixture.detectChanges();

    expect(page.text('#tracks-title')).toBe('Tracks');
    expect(page.text('.track-count')).toBe('1');
    expect(page.text('.track-list li strong')).toBe('Road Atlanta');
    expect(page.text('.track-list li span')).toBe('Braselton, GA');
  });

  it('validates and creates a track through the API', () => {
    const fixture = TestBed.createComponent(App);
    const page = new AppPage(fixture);
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    flushDashboardRequest(http);
    fixture.detectChanges();
    page.clickNavigation('Tracks');
    http.expectOne('/api/tracks').flush([]);
    fixture.detectChanges();

    page.submit('.track-form');
    expect(page.text('.field-error')).toBe('Enter a track name.');
    http.verify();

    page.fill('#track-name', '  Road Atlanta  ');
    page.fill('#track-location', ' Braselton, GA ');
    page.submit('.track-form');

    const request = http.expectOne('/api/tracks');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ name: 'Road Atlanta', location: 'Braselton, GA' });
    request.flush({ id: 1, userId: 1, name: 'Road Atlanta', location: 'Braselton, GA' });
    fixture.detectChanges();

    expect(page.text('.track-list li strong')).toBe('Road Atlanta');
    expect(page.text('.track-list li span')).toBe('Braselton, GA');
  });
});
