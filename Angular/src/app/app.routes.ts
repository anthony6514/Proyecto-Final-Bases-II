import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { RegionComponent } from './pages/region/region';
import { EcuadorComponent } from './pages/ecuador/ecuador';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'region', component: RegionComponent },
  { path: 'ecuador', component: EcuadorComponent },
  { path: '**', redirectTo: 'home' }
];
