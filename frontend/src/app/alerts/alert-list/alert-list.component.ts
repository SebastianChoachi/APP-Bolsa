import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Mis Alertas</h2>
      <table>
        <thead>
          <tr>
            <th>Criptomoneda</th>
            <th>Condición</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let alerta of alertas">
            <td>{{ alerta.crypto_name }}</td>
            <td>{{ alerta.condicion }}</td>
            <td>{{ alerta.precio | currency:'USD' }}</td>
            <td>{{ alerta.estado ? 'Activa' : 'Inactiva' }}</td>
            <td>
              <button (click)="eliminarAlerta(alerta.id)">🗑 Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button (click)="crearAlerta()">➕ Nueva Alerta</button>
    </div>
  `,
  styles: [`
    .container {
      width: 80%;
      margin: auto;
      text-align: center;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
    }
    th {
      background-color: #4CAF50;
      color: white;
    }
    button {
      background-color: #008CBA;
      color: white;
      padding: 5px 10px;
      border: none;
      cursor: pointer;
    }
  `]
})
export class AlertListComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  alertas: any[] = [];

  constructor() {
    this.cargarAlertas();
  }

  cargarAlertas() {
    const token = localStorage.getItem('token');

    this.http.get<any[]>('http://localhost:5000/alerts/', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data) => this.alertas = data,
      error: (err) => console.error("Error al obtener alertas:", err)
    });
  }

  eliminarAlerta(id: number) {
    const token = localStorage.getItem('token');

    this.http.delete(`http://localhost:5000/alerts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => this.cargarAlertas(),  // Recargar alertas tras eliminar
      error: (err) => console.error("Error al eliminar alerta:", err)
    });
  }

  crearAlerta() {
    this.router.navigate(['/alerts/new']);  // Redirigir a la página de creación
  }
}
