import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Track } from './tracks.store';

@Injectable({ providedIn: 'root' })
export class TracksApiService {
  private readonly http = inject(HttpClient);

  list(): Observable<Track[]> {
    return this.http.get<Track[]>('/api/tracks');
  }

  create(track: {
    name: string;
    city: string | null;
    country: string | null;
    lengthMiles: number | null;
  }): Observable<Track> {
    return this.http.post<Track>('/api/tracks', track);
  }
}
