import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { App } from '../app';
import { authFeature } from '../auth.store';
import { DashboardEffects } from '../dashboard/dashboard.effects';
import { dashboardFeature } from '../dashboard/dashboard.store';
import { AppPage } from '../testing/app-page';
import { flushDashboardRequest } from '../testing/http-test-data';
import { VehiclesEffects } from './vehicles.effects';
import { vehiclesFeature } from './vehicles.store';

describe('Vehicles page integration', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore({
          [dashboardFeature.name]: dashboardFeature.reducer,
          [authFeature.name]: authFeature.reducer,
          [vehiclesFeature.name]: vehiclesFeature.reducer,
        }),
        provideEffects(DashboardEffects, VehiclesEffects),
      ],
    }).compileComponents();
  });

  it('loads saved vehicles after navigating to the page', () => {
    const fixture = TestBed.createComponent(App);
    const page = new AppPage(fixture);
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    flushDashboardRequest(http);
    fixture.detectChanges();

    page.clickNavigation('Vehicles');
    http
      .expectOne('/api/vehicles')
      .flush([
        { id: 1, userId: 1, name: 'Sunday Driver', make: 'Mazda', model: 'MX-5 Miata', year: 2020 },
      ]);
    fixture.detectChanges();

    expect(page.text('#vehicles-title')).toBe('Vehicles');
    expect(page.text('.vehicle-count')).toBe('1');
    expect(page.text('.vehicle-list li strong')).toBe('Sunday Driver');
    expect(page.text('.vehicle-list li span')).toBe('Mazda · MX-5 Miata · 2020');
  });

  it('validates and creates a vehicle through the API', () => {
    const fixture = TestBed.createComponent(App);
    const page = new AppPage(fixture);
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    flushDashboardRequest(http);
    fixture.detectChanges();
    page.clickNavigation('Vehicles');
    http.expectOne('/api/vehicles').flush([]);
    fixture.detectChanges();

    page.submit('.vehicle-form');
    expect(page.text('.field-error')).toContain('Enter a vehicle name.');
    expect(page.text('.field-error')).not.toContain('Enter a year');
    http.verify();

    page.fill('#vehicle-name', ' Sunday Driver ');
    page.fill('#vehicle-make', 'Mazda');
    page.fill('#vehicle-model', 'MX-5 Miata');
    page.fill('#vehicle-year', '2020');
    page.submit('.vehicle-form');

    const request = http.expectOne('/api/vehicles');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      name: 'Sunday Driver',
      make: 'Mazda',
      model: 'MX-5 Miata',
      year: 2020,
    });
    request.flush({
      id: 1,
      userId: 1,
      name: 'Sunday Driver',
      make: 'Mazda',
      model: 'MX-5 Miata',
      year: 2020,
    });
    fixture.detectChanges();

    expect(page.text('.vehicle-list li strong')).toBe('Sunday Driver');
    expect(page.text('.vehicle-list li span')).toBe('Mazda · MX-5 Miata · 2020');
  });
});
