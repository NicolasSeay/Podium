import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CompletedTrackDay, Track, TrackDayStats, Vehicle } from './track-days.store';

@Injectable({ providedIn: 'root' })
export class TrackDaysApiService {
  private readonly http = inject(HttpClient);

  list(): Observable<CompletedTrackDay[]> {
    return this.http.get<CompletedTrackDay[]>('/api/track-days');
  }
  stats(): Observable<TrackDayStats[]> {
    return this.http.get<TrackDayStats[]>('/api/track-days/stats');
  }
  tracks(): Observable<Track[] | null> {
    return this.http.get<Track[] | null>('/api/tracks');
  }
  vehicles(): Observable<Vehicle[] | null> {
    return this.http.get<Vehicle[] | null>('/api/vehicles');
  }
  create(trackDay: {
    trackId: number;
    vehicleId: number;
    startDate: string;
    endDate: string;
    notes: string | null;
    conditions: string | null;
    sessions: {
      name: string;
      notes: string | null;
      sessionDate: string;
      laps: { lapNumber: number; timeMillis: number }[];
    }[];
  }): Observable<CompletedTrackDay> {
    return this.http.post<CompletedTrackDay>('/api/track-days', trackDay);
  }
}
