import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { App } from './app';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', canActivate: [authGuard], component: App },
  { path: 'track-days', canActivate: [authGuard], component: App },
  { path: 'sessions', canActivate: [authGuard], component: App },
  { path: 'analytics', canActivate: [authGuard], component: App },
  { path: 'tracks', canActivate: [authGuard], component: App },
  { path: 'vehicles', canActivate: [authGuard], component: App },
  { path: 'records', canActivate: [authGuard], component: App },
  { path: 'goals', canActivate: [authGuard], component: App },
  { path: 'settings', canActivate: [authGuard], component: App },
  { path: '**', redirectTo: 'login' },
];
