import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TrackDaysApiService } from './track-days-api.service';
import { Track, TrackDay, Vehicle } from './track-days.store';
import { AppHeaderComponent } from '../app-header/app-header.component';

type DraftLap = { timeMillis: number; displayTime: string };
type DraftSession = { name: string; notes: string | null; laps: DraftLap[] };
type DraftDay = { date: string; sessions: DraftSession[] };

@Component({
  selector: 'app-track-day-create',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, AppHeaderComponent],
  templateUrl: './track-day-create.component.html',
  styleUrl: './track-day-create.component.scss',
})
export class TrackDayCreateComponent {
  private readonly api = inject(TrackDaysApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly tracks = signal<Track[]>([]);
  protected readonly trackDays = signal<TrackDay[]>([]);
  protected readonly vehicles = signal<Vehicle[]>([]);
  protected readonly days = signal<DraftDay[]>([]);
  protected readonly step = signal(1);
  protected readonly saving = signal(false);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly recentTracks = computed(() => {
    const racedTrackIds = new Set(this.trackDays().map((trackDay) => trackDay.trackId));
    return this.tracks().filter((track) => racedTrackIds.has(track.id));
  });
  protected readonly otherTracks = computed(() => {
    const recentTrackIds = new Set(this.recentTracks().map((track) => track.id));
    return this.tracks().filter((track) => !recentTrackIds.has(track.id));
  });
  protected readonly eventForm = this.formBuilder.nonNullable.group({
    trackId: [0, [Validators.required, Validators.min(1)]],
    vehicleId: [0, [Validators.required, Validators.min(1)]],
    startDate: [new Date().toISOString().slice(0, 10), Validators.required],
    endDate: [new Date().toISOString().slice(0, 10), Validators.required],
    conditions: [''],
    notes: [''],
  });
  constructor() {
    forkJoin({
      tracks: this.api.tracks(),
      vehicles: this.api.vehicles(),
      trackDays: this.api.list(),
    }).subscribe({
      next: (data) => {
        this.tracks.set(data.tracks);
        this.trackDays.set(data.trackDays);
        this.vehicles.set(data.vehicles);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to load tracks and vehicles.');
        this.loading.set(false);
      },
    });
  }

  protected nextStep(): void {
    if (this.step() === 1) {
      if (
        this.eventForm.invalid ||
        this.eventForm.controls.endDate.value < this.eventForm.controls.startDate.value
      ) {
        this.eventForm.markAllAsTouched();
        this.error.set('Choose an end date on or after the start date.');
        return;
      }
      this.error.set(null);
      this.days.update((days) => this.buildDays(days));
    }
    this.step.update((value) => Math.min(value + 1, 3));
  }

  protected previousStep(): void {
    this.error.set(null);
    this.step.update((value) => Math.max(value - 1, 1));
  }

  protected handleVehicleChange(): void {
    if (this.eventForm.controls.vehicleId.value === -1) {
      this.eventForm.controls.vehicleId.setValue(0);
      void this.router.navigate(['/vehicles']);
    }
  }

  protected addSession(date: string): void {
    this.days.update((days) =>
      days.map((day) =>
        day.date === date
          ? {
              ...day,
              sessions: [...day.sessions, { name: '', notes: null, laps: [this.emptyLap()] }],
            }
          : day,
      ),
    );
  }

  protected updateSession(
    dayIndex: number,
    sessionIndex: number,
    field: 'name' | 'notes',
    value: string,
  ): void {
    this.days.update((days) =>
      days.map((day, currentDayIndex) =>
        currentDayIndex === dayIndex
          ? {
              ...day,
              sessions: day.sessions.map((session, currentSessionIndex) =>
                currentSessionIndex === sessionIndex
                  ? { ...session, [field]: field === 'notes' ? value || null : value }
                  : session,
              ),
            }
          : day,
      ),
    );
  }

  protected removeSession(dayIndex: number, sessionIndex: number): void {
    this.days.update((days) =>
      days.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              sessions: day.sessions.filter((_, currentIndex) => currentIndex !== sessionIndex),
            }
          : day,
      ),
    );
  }

  protected updateLap(
    dayIndex: number,
    sessionIndex: number,
    lapIndex: number,
    value: string,
  ): void {
    const timeMillis = this.parseLapTime(value);
    this.days.update((days) =>
      days.map((day, currentDayIndex) =>
        currentDayIndex === dayIndex
          ? {
              ...day,
              sessions: day.sessions.map((session, currentSessionIndex) =>
                currentSessionIndex === sessionIndex
                  ? {
                      ...session,
                      laps: session.laps.reduce<DraftLap[]>((laps, lap, currentLapIndex) => {
                        laps.push(
                          currentLapIndex === lapIndex ? { timeMillis, displayTime: value } : lap,
                        );
                        if (
                          currentLapIndex === lapIndex &&
                          value.trim() &&
                          lapIndex === session.laps.length - 1
                        ) {
                          laps.push(this.emptyLap());
                        }
                        return laps;
                      }, []),
                    }
                  : session,
              ),
            }
          : day,
      ),
    );
  }

  protected removeLap(dayIndex: number, sessionIndex: number, lapIndex: number): void {
    this.days.update((days) =>
      days.map((day, currentDayIndex) =>
        currentDayIndex === dayIndex
          ? {
              ...day,
              sessions: day.sessions.map((session, currentSessionIndex) =>
                currentSessionIndex === sessionIndex
                  ? {
                      ...session,
                      laps: session.laps.filter(
                        (_, currentLapIndex) => currentLapIndex !== lapIndex,
                      ).length
                        ? session.laps.filter((_, currentLapIndex) => currentLapIndex !== lapIndex)
                        : [this.emptyLap()],
                    }
                  : session,
              ),
            }
          : day,
      ),
    );
  }

  protected complete(): void {
    const sessions = this.days().flatMap((day) =>
      day.sessions
        .filter((session) => session.name.trim())
        .map(({ name, notes, laps }) => ({
          name: name.trim(),
          notes: notes?.trim() || null,
          sessionDate: day.date,
          laps: laps
            .filter((lap) => lap.timeMillis > 0)
            .map(({ timeMillis }, lapIndex) => ({ lapNumber: lapIndex + 1, timeMillis })),
        })),
    );
    if (!sessions.length) {
      this.error.set('Add at least one session before completing the track day.');
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    const event = this.eventForm.getRawValue();
    this.api
      .complete({
        ...event,
        trackId: Number(event.trackId),
        vehicleId: event.vehicleId ? Number(event.vehicleId) : null,
        notes: event.notes.trim() || null,
        conditions: event.conditions.trim() || null,
        sessions,
      })
      .subscribe({
        next: () => void this.router.navigate(['/track-days']),
        error: () => {
          this.error.set('Unable to save the complete track day. Nothing was persisted.');
          this.saving.set(false);
        },
      });
  }

  protected dayLabel(date: string): string {
    return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  private emptyLap(): DraftLap {
    return { timeMillis: 0, displayTime: '' };
  }

  private parseLapTime(value: string): number {
    const parts = value.trim().split(':');
    const timeMillis =
      parts.length === 1
        ? Number(parts[0]) * 1000
        : parts.length === 2
          ? (Number(parts[0]) * 60 + Number(parts[1])) * 1000
          : 0;
    return Number.isFinite(timeMillis) && timeMillis > 0 ? timeMillis : 0;
  }

  private buildDays(existingDays: DraftDay[]): DraftDay[] {
    const start = new Date(`${this.eventForm.controls.startDate.value}T00:00:00Z`);
    const end = new Date(`${this.eventForm.controls.endDate.value}T00:00:00Z`);
    const sessionsByDate = new Map(existingDays.map((day) => [day.date, day.sessions]));
    const days: DraftDay[] = [];
    for (
      const current = new Date(start);
      current <= end;
      current.setUTCDate(current.getUTCDate() + 1)
    ) {
      const date = current.toISOString().slice(0, 10);
      days.push({ date, sessions: sessionsByDate.get(date) ?? [] });
    }
    return days;
  }
}
