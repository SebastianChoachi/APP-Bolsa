import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post('http://localhost:5000/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/cryptos']);
      },
      error: (err) => {
        this.errorMessage = err.error.error || 'Error en el login';
      }
    });
  }
}
