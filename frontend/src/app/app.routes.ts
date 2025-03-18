import { Routes } from '@angular/router';
import { CryptoListComponent } from './cryptos/crypto-list/crypto-list.component';
import { CryptoDetailComponent } from './cryptos/crypto-details/crypto-detail.component';

export const routes: Routes = [
  { path: 'cryptos', component: CryptoListComponent },
  { path: 'cryptos/:nombre', component: CryptoDetailComponent },
  { path: '', redirectTo: '/cryptos', pathMatch: 'full' }
];
