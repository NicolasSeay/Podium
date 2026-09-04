import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { DashboardEffects } from './dashboard/dashboard.effects';
import { dashboardFeature } from './dashboard/dashboard.store';
import { authInterceptor } from './auth.interceptor';
import { authFeature } from './auth.store';
import { VehiclesEffects } from './vehicles/vehicles.effects';
import { vehiclesFeature } from './vehicles/vehicles.store';
import { TrackDaysEffects } from './track-days/track-days.effects';
import { trackDaysFeature } from './track-days/track-days.store';
import { AuthEffects } from './auth.effects';
import { apiUrlInterceptor } from './api-url.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([apiUrlInterceptor, authInterceptor])),
    provideRouter(routes),
    provideStore({
      [dashboardFeature.name]: dashboardFeature.reducer,
      [vehiclesFeature.name]: vehiclesFeature.reducer,
      [authFeature.name]: authFeature.reducer,
      [trackDaysFeature.name]: trackDaysFeature.reducer,
    }),
    provideEffects(AuthEffects, DashboardEffects, VehiclesEffects, TrackDaysEffects),
  ],
};
