import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TrackDaysApiService } from './track-days-api.service';
import { Track, Vehicle } from './track-days.store';
import { AppHeaderComponent } from '../app-header.component';

type DraftLap = { lapNumber: number; timeMillis: number; displayTime: string };
type DraftSession = { name: string; notes: string | null; laps: DraftLap[] };

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
  protected readonly vehicles = signal<Vehicle[]>([]);
  protected readonly sessions = signal<DraftSession[]>([]);
  protected readonly step = signal(1);
  protected readonly saving = signal(false);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly eventForm = this.formBuilder.nonNullable.group({
    trackId: [0, [Validators.required, Validators.min(1)]],
    vehicleId: [0],
    startDate: [new Date().toISOString().slice(0, 10), Validators.required],
    endDate: [new Date().toISOString().slice(0, 10), Validators.required],
    conditions: [''],
    notes: [''],
  });
  protected readonly sessionForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    notes: [''],
  });
  protected readonly lapForm = this.formBuilder.nonNullable.group({
    lapNumber: [1, [Validators.required, Validators.min(1)]],
    time: ['', Validators.required],
  });

  constructor() {
    forkJoin({ tracks: this.api.tracks(), vehicles: this.api.vehicles() }).subscribe({
      next: (data) => {
        this.tracks.set(data.tracks);
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
    }
    this.step.update((value) => Math.min(value + 1, 3));
  }

  protected previousStep(): void {
    this.error.set(null);
    this.step.update((value) => Math.max(value - 1, 1));
  }

  protected addSession(): void {
    if (this.sessionForm.invalid) {
      this.sessionForm.markAllAsTouched();
      return;
    }
    const value = this.sessionForm.getRawValue();
    this.sessions.update((sessions) => [
      ...sessions,
      { name: value.name.trim(), notes: value.notes.trim() || null, laps: [] },
    ]);
    this.sessionForm.reset({ name: '', notes: '' });
  }

  protected removeSession(index: number): void {
    this.sessions.update((sessions) =>
      sessions.filter((_, sessionIndex) => sessionIndex !== index),
    );
  }

  protected addLap(sessionIndex: number): void {
    if (this.lapForm.invalid) {
      this.lapForm.markAllAsTouched();
      return;
    }
    const value = this.lapForm.getRawValue();
    const parts = value.time.split(':');
    const timeMillis =
      parts.length === 2 ? Math.round((Number(parts[0]) * 60 + Number(parts[1])) * 1000) : 0;
    if (!Number.isFinite(timeMillis) || timeMillis <= 0) {
      this.lapForm.controls.time.setErrors({ invalidTime: true });
      return;
    }
    this.sessions.update((sessions) =>
      sessions.map((session, index) =>
        index === sessionIndex
          ? {
              ...session,
              laps: [
                ...session.laps,
                { lapNumber: Number(value.lapNumber), timeMillis, displayTime: value.time },
              ],
            }
          : session,
      ),
    );
    this.lapForm.reset({ lapNumber: this.sessions()[sessionIndex].laps.length + 1, time: '' });
  }

  protected removeLap(sessionIndex: number, lapIndex: number): void {
    this.sessions.update((sessions) =>
      sessions.map((session, index) =>
        index === sessionIndex
          ? {
              ...session,
              laps: session.laps.filter((_, currentLapIndex) => currentLapIndex !== lapIndex),
            }
          : session,
      ),
    );
  }

  protected complete(): void {
    if (!this.sessions().length) {
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
        sessions: this.sessions().map(({ name, notes, laps }) => ({
          name,
          notes,
          laps: laps.map(({ lapNumber, timeMillis }) => ({ lapNumber, timeMillis })),
        })),
      })
      .subscribe({
        next: () => void this.router.navigate(['/track-days']),
        error: () => {
          this.error.set('Unable to save the complete track day. Nothing was persisted.');
          this.saving.set(false);
        },
      });
  }
}
