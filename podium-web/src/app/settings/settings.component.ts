import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, map, of } from 'rxjs';
import { AuthFacade } from '../auth.facade';
import { AuthService } from '../auth.service';
import { TrackDaysFacade } from '../track-days/track-days.facade';
import { DistanceUnit, TemperatureUnit } from '../preferences';

@Component({
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly authFacade = inject(AuthFacade);
  private readonly trackDaysFacade = inject(TrackDaysFacade);

  protected readonly tracks = this.trackDaysFacade.tracks;
  protected readonly vehicles = this.trackDaysFacade.vehicles;
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly saved = signal(false);
  protected readonly form = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: [
      '',
      [Validators.required, Validators.email, Validators.maxLength(254)],
      [this.emailAvailableValidator()],
    ],
    distanceUnit: [DistanceUnit.Miles],
    temperatureUnit: [TemperatureUnit.Fahrenheit],
    defaultTrackId: [null as number | null],
    defaultVehicleId: [null as number | null],
  });

  constructor() {
    this.trackDaysFacade.load();
    effect(() => {
      const user = this.authFacade.user();
      if (user && !this.form.dirty) {
        this.form.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          distanceUnit: user.distanceUnit ?? DistanceUnit.Miles,
          temperatureUnit: user.temperatureUnit ?? TemperatureUnit.Fahrenheit,
          defaultTrackId: user.defaultTrackId ?? null,
          defaultVehicleId: user.defaultVehicleId ?? null,
        });
      }
    });
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.saved.set(false);
    this.error.set(null);
    this.auth.updateUser(this.form.getRawValue()).subscribe({
      next: (user) => {
        this.authFacade.userLoaded(user);
        this.saving.set(false);
        this.saved.set(true);
        this.form.markAsPristine();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.error.set(
          error instanceof HttpErrorResponse && error.status === 409
            ? 'That email address is already in use.'
            : 'Unable to save your settings.',
        );
      },
    });
  }

  protected hasError(controlName: string, errorName: string): boolean {
    const control = this.form.get(controlName);
    if (!control) return false;
    return control.invalid && (control.dirty || control.touched) && control.hasError(errorName);
  }

  private emailAvailableValidator(): AsyncValidatorFn {
    return (control) =>
      this.auth.emailAvailable(control.value).pipe(
        map((available) => (available ? null : { emailTaken: true })),
        catchError(() => of(null)),
      );
  }
}
