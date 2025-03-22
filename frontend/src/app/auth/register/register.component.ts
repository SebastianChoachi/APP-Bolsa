import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // 🔹 Importar CommonModule
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [FormsModule, CommonModule]  // 🔹 Agregar CommonModule
})
export class RegisterComponent {
  nombre: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.http.post('http://localhost:5000/register', {
      nombre: this.nombre,
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.successMessage = 'Registro exitoso. Redirigiendo...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMessage = err.error.error || 'Error en el registro';
      }
    });
  }
}
