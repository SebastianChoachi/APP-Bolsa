import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    const userData = { email: this.email, password: this.password };
    console.log("📤 Enviando datos de login:", userData); // Verificar en consola

    this.http.post('http://localhost:5000/login', userData).subscribe({
      next: (res) => {
        console.log("✅ Login exitoso", res);
        alert("Inicio de sesión exitoso");
      },
      error: (err) => {
        console.error("❌ Error en login", err);
        this.errorMessage = err.error?.error || "Error al iniciar sesión";
      }
    });
  }
}
