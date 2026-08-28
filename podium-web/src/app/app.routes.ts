import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { App } from './app';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', canActivate: [authGuard], component: App },
  { path: '**', redirectTo: 'login' },
];
