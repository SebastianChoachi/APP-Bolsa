import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

// Importamos los componentes
import { CryptoListComponent } from './cryptos/crypto-list/crypto-list.component';
import { CryptoDetailComponent } from './cryptos/crypto-details/crypto-detail.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AlertsComponent } from './alerts/alerts.component';

// Importamos el AuthGuard
import { AuthGuard } from './auth/auth.guard';

// Definimos las rutas
const routes: Routes = [
  { path: 'cryptos', component: CryptoListComponent },
  { path: 'cryptos/:nombre', component: CryptoDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'alerts', component: AlertsComponent, canActivate: [AuthGuard] }, // 🔒 Protegido

  { path: '', redirectTo: 'cryptos', pathMatch: 'full' },
  { path: '**', redirectTo: 'cryptos' }
];

// Configuración de la app con rutas y cliente HTTP
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()), // Se recomienda agregar `withComponentInputBinding`
    provideHttpClient()
  ]
};
