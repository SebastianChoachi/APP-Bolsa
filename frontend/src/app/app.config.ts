import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

// Importación de componentes
import { CryptoListComponent } from './cryptos/crypto-list/crypto-list.component';
import { CryptoDetailComponent } from './cryptos/crypto-details/crypto-detail.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AlertListComponent } from './alerts/alert-list/alert-list.component';
import { AlertFormComponent } from './alerts/alert-form/alert-form.component';

// Importación del AuthGuard
import { AuthGuard } from './auth/auth.guard';

// Definición de las rutas
const routes: Routes = [
  { path: 'cryptos', component: CryptoListComponent },
  { path: 'cryptos/:nombre', component: CryptoDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'alerts', component: AlertListComponent, canActivate: [AuthGuard] },
  { path: 'alerts/create', component: AlertFormComponent, canActivate: [AuthGuard]  },
  //{ path: 'alerts', component: AlertsComponent, canActivate: [AuthGuard] }, // Ruta Protegida para usuario logeados

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
