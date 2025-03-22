import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';  // 🔹 Agregar CommonModule

@Component({
  selector: 'app-crypto-list',
  standalone: true,
  imports: [CommonModule],  // 🔹 Importar CommonModule
  template: `
    <div class="container">
      <h2>Lista de Criptomonedas</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Símbolo</th>
            <th>Precio Actual (USD)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let crypto of cryptos">
            <td>{{ crypto.nombre }}</td>
            <td>{{ crypto.simbolo }}</td>
            <td>{{ crypto.precio | currency:'USD' }}</td>
            <td>
              <button (click)="verDetalle(crypto.nombre)">Ver Detalle</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [
    `
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
    `
  ]
})
export class CryptoListComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  cryptos: any[] = [];

  constructor() {
    this.cargarCryptos();
  }

  cargarCryptos() {
    this.http.get<any[]>('http://localhost:5000/cryptos').subscribe((data) => {
      this.cryptos = data;
      this.obtenerPrecios();
    });
  }

  obtenerPrecios() {
    this.http.get<any>('http://127.0.0.1:5000/cryptos/prices')
      .subscribe((precios) => {
        this.cryptos = this.cryptos.map(c => ({
          ...c,
          precio: precios[c.nombre.toLowerCase()]?.usd || 0  // Accede al precio usando el nombre en minúsculas
        }));
      });
  }

  verDetalle(nombre: string) {
    this.router.navigate(['/cryptos', nombre]);
  }
}
