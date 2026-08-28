import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle } from './vehicles.store';

@Injectable({ providedIn: 'root' })
export class VehiclesApiService {
  private readonly http = inject(HttpClient);

  list(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>('/api/vehicles');
  }

  create(vehicle: {
    name: string;
    make: string | null;
    model: string | null;
    year: number | null;
  }): Observable<Vehicle> {
    return this.http.post<Vehicle>('/api/vehicles', vehicle);
  }
}
