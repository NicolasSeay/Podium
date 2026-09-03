import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  vehicleCreateRequested,
  vehicleDeleteRequested,
  vehiclesFeature,
  vehiclesLoadRequested,
} from './vehicles.store';

@Component({
  selector: 'app-vehicles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss',
})
export class VehiclesComponent {
  private readonly store = inject(Store);
  private readonly formBuilder = inject(FormBuilder);
  protected readonly vehicles = this.store.selectSignal(vehiclesFeature.selectVehicles);
  protected readonly loading = this.store.selectSignal(vehiclesFeature.selectLoading);
  protected readonly saving = this.store.selectSignal(vehiclesFeature.selectSaving);
  protected readonly error = this.store.selectSignal(vehiclesFeature.selectError);
  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    make: [''],
    model: [''],
    trim: [''],
    year: [null as number | null, [Validators.min(1886), Validators.max(2100)]],
  });

  constructor() {
    this.store.dispatch(vehiclesLoadRequested());
  }

  protected createVehicle(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, make, model, trim, year } = this.form.getRawValue();
    this.store.dispatch(
      vehicleCreateRequested({
        name: name.trim(),
        make: make.trim() || null,
        model: model.trim() || null,
        trim: trim.trim() || null,
        year,
      }),
    );
    this.form.reset();
  }

  protected deleteVehicle(vehicleId: number): void {
    const confirmed = window.confirm('Are you sure you want to delete this vehicle?');
    if (!confirmed) {
      return;
    }

    this.store.dispatch(vehicleDeleteRequested(vehicleId));
  }
}
