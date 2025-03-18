import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { CryptoListComponent } from './cryptos/crypto-list/crypto-list.component';
import { CryptoDetailComponent } from './cryptos/crypto-details/crypto-detail.component';
import { provideHttpClient } from '@angular/common/http';

const routes: Routes = [
  { path: 'cryptos', component: CryptoListComponent },
  { path: 'cryptos/:nombre', component: CryptoDetailComponent },
  { path: '', redirectTo: 'cryptos', pathMatch: 'full' },
  { path: '**', redirectTo: 'cryptos' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
};
