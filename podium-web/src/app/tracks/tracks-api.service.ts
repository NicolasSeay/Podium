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

  create(track: { name: string; location: string | null }): Observable<Track> {
    return this.http.post<Track>('/api/tracks', track);
  }
}
