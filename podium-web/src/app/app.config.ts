import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { DashboardEffects } from './dashboard/dashboard.effects';
import { dashboardFeature } from './dashboard/dashboard.store';
import { TracksEffects } from './tracks/tracks.effects';
import { tracksFeature } from './tracks/tracks.store';
import { authInterceptor } from './auth.interceptor';
import { authFeature } from './auth.store';
import { VehiclesEffects } from './vehicles/vehicles.effects';
import { vehiclesFeature } from './vehicles/vehicles.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    provideStore({
      [dashboardFeature.name]: dashboardFeature.reducer,
      [tracksFeature.name]: tracksFeature.reducer,
      [vehiclesFeature.name]: vehiclesFeature.reducer,
      [authFeature.name]: authFeature.reducer,
    }),
    provideEffects(DashboardEffects, TracksEffects, VehiclesEffects),
  ],
};
