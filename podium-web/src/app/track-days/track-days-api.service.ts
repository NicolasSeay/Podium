import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Lap, Session, Track, TrackDay, Vehicle } from './track-days.store';

@Injectable({ providedIn: 'root' })
export class TrackDaysApiService {
  private readonly http = inject(HttpClient);

  list(): Observable<TrackDay[]> {
    return this.http.get<TrackDay[]>('/api/track-days');
  }
  tracks(): Observable<Track[]> {
    return this.http.get<Track[]>('/api/tracks');
  }
  vehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>('/api/vehicles');
  }
  create(trackDay: {
    trackId: number;
    vehicleId: number | null;
    date: string;
    notes: string | null;
    conditions: string | null;
  }): Observable<TrackDay> {
    return this.http.post<TrackDay>('/api/track-days', trackDay);
  }
  sessions(trackDayId: number): Observable<Session[]> {
    return this.http.get<Session[]>(`/api/track-days/${trackDayId}/sessions`);
  }
  createSession(
    trackDayId: number,
    session: { name: string; notes: string | null },
  ): Observable<Session> {
    return this.http.post<Session>(`/api/track-days/${trackDayId}/sessions`, session);
  }
  laps(sessionId: number): Observable<Lap[]> {
    return this.http.get<Lap[]>(`/api/sessions/${sessionId}/laps`);
  }
  createLap(sessionId: number, lap: { lapNumber: number; timeMillis: number }): Observable<Lap> {
    return this.http.post<Lap>(`/api/sessions/${sessionId}/laps`, lap);
  }
}
