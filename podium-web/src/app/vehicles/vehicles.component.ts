import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehiclesFacade } from './vehicles.facade';

@Component({
  selector: 'app-vehicles',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss',
})
export class VehiclesComponent {
  private readonly facade = inject(VehiclesFacade);
  private readonly formBuilder = inject(FormBuilder);
  protected readonly vehicles = this.facade.vehicles;
  protected readonly loading = this.facade.loading;
  protected readonly saving = this.facade.saving;
  protected readonly error = this.facade.error;
  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    make: [''],
    model: [''],
    trim: [''],
    year: [null as number | null, [Validators.min(1886), Validators.max(2100)]],
  });

  constructor() {
    this.facade.load();
  }

  protected createVehicle(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, make, model, trim, year } = this.form.getRawValue();
    this.facade.create({
      name: name.trim(),
      make: make.trim() || null,
      model: model.trim() || null,
      trim: trim.trim() || null,
      year,
    });
    this.form.reset();
  }

  protected deleteVehicle(vehicleId: number): void {
    const confirmed = window.confirm('Are you sure you want to delete this vehicle?');
    if (!confirmed) {
      return;
    }

    this.facade.delete(vehicleId);
  }
}
