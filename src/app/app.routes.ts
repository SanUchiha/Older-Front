import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SociosComponent } from './components/socios/socios.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ReportesComponent } from './components/reportes/reportes.component';

export const routes: Routes = [
    {path: '', title: 'Inicio', component: HomeComponent},
    {path: 'home', title: 'Inicio', component: HomeComponent},
    {path: 'socios', title: 'Socios', component: SociosComponent},
    {path: 'pagos', title: 'Pagos', component: PagosComponent},
    {path: 'reportes', title: 'Reportes', component: ReportesComponent},
    {path: '**', component: PageNotFoundComponent},
];
