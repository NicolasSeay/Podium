import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  vehicleCreateRequested,
  vehicleDeleteRequested,
  vehiclesFeature,
  vehiclesLoadRequested,
} from './vehicles.store';

@Injectable({ providedIn: 'root' })
export class VehiclesFacade {
  private readonly store = inject(Store);

  readonly vehicles = this.store.selectSignal(vehiclesFeature.selectVehicles);
  readonly loading = this.store.selectSignal(vehiclesFeature.selectLoading);
  readonly saving = this.store.selectSignal(vehiclesFeature.selectSaving);
  readonly error = this.store.selectSignal(vehiclesFeature.selectError);

  load(): void {
    this.store.dispatch(vehiclesLoadRequested());
  }

  create(vehicle: Parameters<typeof vehicleCreateRequested>[0]): void {
    this.store.dispatch(vehicleCreateRequested(vehicle));
  }

  delete(id: number): void {
    this.store.dispatch(vehicleDeleteRequested(id));
  }
}
