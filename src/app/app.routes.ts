import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/login.routes').then((m) => m.LOGIN_ROUTES),
  },
  {
    path: 'transport',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./layout/layout.routes').then((m) => m.LAYOUT_ROUTES),
  }, 
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
