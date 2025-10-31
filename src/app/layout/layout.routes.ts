import { Routes } from '@angular/router';

export const LAYOUT_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./layout/layout.component').then((m) => m.LayoutComponent),
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./../dashboard/dashboard.component').then(
                        (m) => m.DashboardComponent
                    ),
            },
            {
                path: 'vehicles',
                loadComponent: () =>
                    import('./../vehicle/vehicle.component').then(
                        (m) => m.VehicleComponent
                    ),
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
            {
                path: '**',
                redirectTo: 'dashboard',
            },
        ],
    },
];
