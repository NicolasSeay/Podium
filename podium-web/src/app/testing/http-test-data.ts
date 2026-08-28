import { HttpTestingController } from '@angular/common/http/testing';

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
