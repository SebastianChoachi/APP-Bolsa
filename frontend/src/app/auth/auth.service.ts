import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:5000';

  // REGISTRO
  register(nombre: string, email: string, password: string) {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/register`,
      { nombre, email, password }
    );
  }


  // LOGIN
  login(email: string, password: string): Observable<{ message: string; user_id: number; token: string }> {
    return this.http.post<{ message: string; user_id: number; token: string }>(
      `${this.apiUrl}/login`,
      { email, password }
    );
  }


  // CERRAR SESIÓN
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
