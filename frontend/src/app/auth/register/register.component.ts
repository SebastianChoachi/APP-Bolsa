import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  nombre: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    const userData = { nombre: this.nombre, email: this.email, password: this.password };
    console.log("📤 Enviando datos de registro:", userData); // Verificar en consola

    this.http.post('http://localhost:5000/register', userData).subscribe({
      next: (res) => {
        console.log("✅ Registro exitoso", res);
        alert("Registro exitoso");
      },
      error: (err) => {
        console.error("❌ Error en registro", err);
        this.errorMessage = err.error?.error || "Error al registrarse";
      }
    });
  }
}
