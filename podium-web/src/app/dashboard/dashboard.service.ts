import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardData } from './store/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getDashboard(
    trackId: number | null = null,
    vehicleId: number | null = null,
  ): Observable<DashboardData> {
    const params: Record<string, string> = {};
    if (trackId !== null) params['trackId'] = trackId.toString();
    if (vehicleId !== null) params['vehicleId'] = vehicleId.toString();
    return this.http.get<DashboardData>('/api/dashboard', { params });
  }
}
