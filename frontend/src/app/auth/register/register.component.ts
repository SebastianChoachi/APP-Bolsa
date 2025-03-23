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
    this.authService.register(this.nombre, this.email, this.password);
  }
}
