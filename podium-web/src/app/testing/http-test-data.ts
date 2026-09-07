import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture } from '@angular/core/testing';
import { App } from '../app';

export function flushDashboardRequest(http: HttpTestingController): void {
  http.expectOne('/api/dashboard').flush({
    personalRecords: [],
    totalTrackDays: 0,
    totalSessions: 0,
    totalLaps: 0,
    totalLapTimeMillis: 0,
    recentTrackDays: [],
  });
}

export async function flushDashboardEntry(
  http: HttpTestingController,
  fixture: ComponentFixture<App>,
): Promise<void> {
  http
    .expectOne('/api/tracks')
    .flush([{ id: 1, name: 'North Circuit', city: 'Northport', country: 'US', lengthMiles: 2 }]);
  http.expectOne('/api/vehicles').flush([]);
  http.expectOne('/api/track-days').flush([
    {
      id: 1,
      userId: 1,
      trackId: 1,
      vehicleId: 1,
      startDate: '2026-09-03',
      notes: null,
      conditions: null,
    },
  ]);
  http.expectOne('/api/track-days/stats').flush([]);
  await fixture.whenStable();
  http
    .expectOne((request) => request.url === '/api/dashboard')
    .flush({
      personalRecords: [],
      totalTrackDays: 0,
      totalSessions: 0,
      totalLaps: 0,
      totalLapTimeMillis: 0,
      recentTrackDays: [],
    });
}
