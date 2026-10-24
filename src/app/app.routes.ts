import { Routes } from '@angular/router';
import { HomePage } from './home-page';
import { LegalPage } from './legal-page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'privacy', component: LegalPage, data: { doc: 'priv' } },
  { path: 'terms', component: LegalPage, data: { doc: 'terms' } },
  { path: '**', redirectTo: '' },
];
