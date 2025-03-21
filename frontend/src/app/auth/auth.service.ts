import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000';

  // REGISTRO
  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { name, email, password });
  }

  // LOGIN
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // GUARDAR EL USUARIO O TOKEN
  saveUser(user_id: string) {
    localStorage.setItem('user_id', user_id);
  }

  // OBTENER EL USUARIO
  getUser() {
    return localStorage.getItem('user_id');
  }

  // CERRAR SESIÓN
  logout() {
    localStorage.removeItem('user_id');
  }
}
