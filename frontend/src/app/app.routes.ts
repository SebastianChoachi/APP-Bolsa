import { Routes } from '@angular/router';
import { CryptoListComponent } from './cryptos/crypto-list/crypto-list.component';
import { CryptoDetailComponent } from './cryptos/crypto-details/crypto-detail.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
//import { AlertsComponent } from './alerts/alerts.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'cryptos', component: CryptoListComponent },
  { path: 'cryptos/:nombre', component: CryptoDetailComponent },
  { path: '', redirectTo: '/cryptos', pathMatch: 'full' }
];
