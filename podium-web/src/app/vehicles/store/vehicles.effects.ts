import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { VehiclesService } from '../vehicles.service';
import {
  vehicleCreateRequested,
  vehicleCreated,
  vehicleDeleteRequested,
  vehicleDeleted,
  vehiclesLoaded,
  vehiclesLoadRequested,
  vehiclesRequestFailed,
} from './vehicles.actions';

@Injectable()
export class VehiclesEffects {
  private readonly actions$ = inject(Actions);
  private readonly vehiclesApi = inject(VehiclesService);

  readonly loadVehicles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(vehiclesLoadRequested),
      switchMap(() =>
        this.vehiclesApi.list().pipe(
          map((vehicles) => vehiclesLoaded(vehicles)),
          catchError(() => of(vehiclesRequestFailed('Unable to load vehicles'))),
        ),
      ),
    ),
  );

  readonly createVehicle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(vehicleCreateRequested),
      switchMap(({ vehicle }) =>
        this.vehiclesApi.create(vehicle).pipe(
          map((createdVehicle) => vehicleCreated(createdVehicle)),
          catchError(() => of(vehiclesRequestFailed('Unable to create vehicle'))),
        ),
      ),
    ),
  );

  readonly deleteVehicle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(vehicleDeleteRequested),
      switchMap(({ id }) =>
        this.vehiclesApi.delete(id).pipe(
          map(() => vehicleDeleted(id)),
          catchError(() => of(vehiclesRequestFailed('Unable to delete vehicle'))),
        ),
      ),
    ),
  );
}
