import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { DashboardEffects } from './dashboard/dashboard.effects';
import { dashboardFeature } from './dashboard/dashboard.store';
import { TracksEffects } from './tracks/tracks.effects';
import { tracksFeature } from './tracks/tracks.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    provideStore({
      [dashboardFeature.name]: dashboardFeature.reducer,
      [tracksFeature.name]: tracksFeature.reducer,
    }),
    provideEffects(DashboardEffects, TracksEffects),
  ],
};
