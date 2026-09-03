import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  lapCreateRequested,
  sessionCreateRequested,
  sessionsLoadRequested,
  trackDayCreateRequested,
  trackDaySelected,
  trackDaysFeature,
  trackDaysLoadRequested,
  TrackDay,
} from './track-days.store';

@Component({
  selector: 'app-track-days',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './track-days.component.html',
  styleUrl: './track-days.component.scss',
})
export class TrackDaysComponent {
  private readonly store = inject(Store);
  private readonly formBuilder = inject(FormBuilder);
  protected readonly tracks = this.store.selectSignal(trackDaysFeature.selectTracks);
  protected readonly vehicles = this.store.selectSignal(trackDaysFeature.selectVehicles);
  protected readonly trackDays = this.store.selectSignal(trackDaysFeature.selectTrackDays);
  protected readonly sessions = this.store.selectSignal(trackDaysFeature.selectSessions);
  protected readonly laps = this.store.selectSignal(trackDaysFeature.selectLaps);
  protected readonly loading = this.store.selectSignal(trackDaysFeature.selectLoading);
  protected readonly saving = this.store.selectSignal(trackDaysFeature.selectSaving);
  protected readonly error = this.store.selectSignal(trackDaysFeature.selectError);
  protected readonly selectedDayId = this.store.selectSignal(trackDaysFeature.selectSelectedDayId);
  protected readonly selectedDay = computed(
    () => this.trackDays().find((day) => day.id === this.selectedDayId()) ?? null,
  );
  protected readonly dayForm = this.formBuilder.nonNullable.group({
    trackId: [0, [Validators.required, Validators.min(1)]],
    vehicleId: [0],
    date: [new Date().toISOString().slice(0, 10), Validators.required],
    conditions: [''],
    notes: [''],
  });
  protected readonly sessionForm = this.formBuilder.nonNullable.group({
    name: ['Session 1', Validators.required],
    notes: [''],
  });
  protected readonly lapForms = new Map<
    number,
    FormGroup<{ lapNumber: FormControl<number>; time: FormControl<string> }>
  >();

  constructor() {
    this.store.dispatch(trackDaysLoadRequested());
  }

  protected createTrackDay(): void {
    if (this.dayForm.invalid) {
      this.dayForm.markAllAsTouched();
      return;
    }
    const value = this.dayForm.getRawValue();
    this.store.dispatch(
      trackDayCreateRequested({
        ...value,
        trackId: Number(value.trackId),
        vehicleId: value.vehicleId ? Number(value.vehicleId) : null,
        notes: value.notes.trim() || null,
        conditions: value.conditions.trim() || null,
      }),
    );
    this.dayForm.reset({
      trackId: 0,
      vehicleId: 0,
      date: new Date().toISOString().slice(0, 10),
      conditions: '',
      notes: '',
    });
  }

  protected openDay(day: TrackDay): void {
    this.store.dispatch(trackDaySelected(day));
    this.store.dispatch(sessionsLoadRequested(day.id));
  }

  protected createSession(): void {
    const dayId = this.selectedDayId();
    if (!dayId || this.sessionForm.invalid) {
      this.sessionForm.markAllAsTouched();
      return;
    }
    const value = this.sessionForm.getRawValue();
    this.store.dispatch(
      sessionCreateRequested(dayId, { name: value.name.trim(), notes: value.notes.trim() || null }),
    );
    this.sessionForm.reset({ name: `Session ${this.sessions().length + 1}`, notes: '' });
  }

  protected lapForm(
    sessionId: number,
  ): FormGroup<{ lapNumber: FormControl<number>; time: FormControl<string> }> {
    let form = this.lapForms.get(sessionId);
    if (!form) {
      form = this.formBuilder.nonNullable.group({
        lapNumber: [1, [Validators.required, Validators.min(1)]],
        time: ['', Validators.required],
      });
      this.lapForms.set(sessionId, form);
    }
    return form;
  }

  protected createLap(sessionId: number): void {
    const form = this.lapForm(sessionId);
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }
    const value = form.getRawValue();
    const parts = value.time.split(':');
    const timeMillis =
      parts.length === 2 ? Math.round((Number(parts[0]) * 60 + Number(parts[1])) * 1000) : 0;
    if (timeMillis <= 0) {
      form.controls.time.setErrors({ invalidTime: true });
      return;
    }
    this.store.dispatch(
      lapCreateRequested(sessionId, { lapNumber: Number(value.lapNumber), timeMillis }),
    );
    form.reset({ lapNumber: (this.laps()[sessionId]?.length ?? 0) + 2, time: '' });
  }

  protected trackName(trackId: number): string {
    return this.tracks().find((track) => track.id === trackId)?.name ?? `Track ${trackId}`;
  }
  protected vehicleName(vehicleId: number | null): string {
    return vehicleId
      ? (this.vehicles().find((vehicle) => vehicle.id === vehicleId)?.name ??
          `Vehicle ${vehicleId}`)
      : 'No vehicle';
  }
  protected formatLapTime(timeMillis: number): string {
    return `${Math.floor(timeMillis / 60000)}:${((timeMillis % 60000) / 1000).toFixed(3).padStart(6, '0')}`;
  }
}
