import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SociosComponent } from './components/socios/socios.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
    {path: '', title: 'Inicio', component: HomeComponent},
    {path: 'home', title: 'Inicio', component: HomeComponent},
    {path: 'socios', title: 'Socios', component: SociosComponent},
    {path: 'pagos', title: 'Pagos', component: PagosComponent},
    {path: 'reportes', title: 'Reportes', loadComponent: () => import('./components/reportes/reportes.component').then(component => component.ReportesComponent)},
    {path: '**', component: PageNotFoundComponent},
];
