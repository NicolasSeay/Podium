import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { DashboardEffects } from './dashboard/dashboard.effects';
import { dashboardFeature } from './dashboard/dashboard.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    provideStore({ [dashboardFeature.name]: dashboardFeature.reducer }),
    provideEffects(DashboardEffects),
  ],
};
