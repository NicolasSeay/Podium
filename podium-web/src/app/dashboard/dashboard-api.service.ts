import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardData } from './dashboard.store';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {
  private readonly http = inject(HttpClient);

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>('/api/dashboard');
  }
}
