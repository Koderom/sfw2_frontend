import { authGuard } from '@/core/guards/auth-guard';
import { Login } from '@/modules/auth/login/login';
import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { PanelControl } from '@/modules/monitoreo/panel-control/panel-control';

export const appRoutes: Routes = [
    {
        path: 'auth/login', 
        component: Login,
    },
    {
        canMatch: [authGuard],
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: PanelControl },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'pacientes', loadChildren: () => import('./app/modules/paciente/paciente.routes')},
            { path: 'tratamientos', loadChildren: () => import('./app/modules/tratamiento/tratamiento.routes')},
            { path: 'reportes', loadChildren: () => import('./app/modules/reportes/reportes.routes')},

        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
