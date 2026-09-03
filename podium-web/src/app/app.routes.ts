import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { App } from './app';
import { LoginComponent } from './login/login.component';
import { TrackDayCreateComponent } from './track-days/track-day-create.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', canActivate: [authGuard], component: App },
  { path: 'track-days', canActivate: [authGuard], component: App },
  { path: 'track-days/new', canActivate: [authGuard], component: TrackDayCreateComponent },
  { path: 'analytics', canActivate: [authGuard], component: App },
  { path: 'vehicles', canActivate: [authGuard], component: App },
  { path: 'settings', canActivate: [authGuard], component: App },
  { path: '**', redirectTo: 'login' },
];
