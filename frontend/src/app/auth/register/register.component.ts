import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';  // Importa el servicio de autenticación
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [FormsModule, CommonModule, RouterModule],
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  nombre: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private authService: AuthService) {}

  register() {
    this.errorMessage = '';
    this.successMessage = '';

    // Validaciones simples antes de llamar al servicio
    if (!this.nombre.trim() || this.nombre.length < 4) {
      this.errorMessage = 'Ingrese un nombre valido (al menos 5 caracteres)';
      return;
    }

    if (!this.email.includes('@') || this.email.length < 9) {
      this.errorMessage = 'Ingrese un correo válido.';
      return;
    }

    if (this.password.length < 8) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    // Llamamos al servicio
    this.authService.register(this.nombre, this.email, this.password).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Error en el registro.';
        this.successMessage = '';
      }
    });
  }

}
