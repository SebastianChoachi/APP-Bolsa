import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crypto-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crypto-list.component.html',
  styleUrls: ['./crypto-list.component.scss']
})
export class CryptoListComponent {
  private http = inject(HttpClient);
  private router = inject(Router);

  cryptos: any[] = [];
  cryptosFiltrados: any[] = [];
  filtro: string = "";
  orden: string = "";

  constructor() {
    this.cargarCryptos();
  }

  cargarCryptos() {
    this.http.get<any[]>('http://localhost:5000/cryptos').subscribe({
      next: (data) => {
        this.cryptos = data;
        this.cryptosFiltrados = [...this.cryptos];
        this.obtenerPrecios();
      },
      error: (err) => console.error("Error al obtener criptos:", err)
    });
  }

  obtenerPrecios() {
    this.http.get<any>('http://127.0.0.1:5000/cryptos/prices')
      .subscribe({
        next: (precios) => {
          this.cryptos = this.cryptos.map(c => ({
            ...c,
            precio: precios[c.nombre.toLowerCase()]?.usd || 0
          }));
          this.filtrarLista();
        },
        error: (err) => console.error("Error al obtener precios:", err)
      });
  }

  filtrarLista() {
    // Filtrar criptomonedas según el input
    this.cryptosFiltrados = this.cryptos.filter(c =>
      c.nombre.toLowerCase().includes(this.filtro.toLowerCase()) ||
      c.simbolo.toLowerCase().includes(this.filtro.toLowerCase())
    );
    // Aplicar ordenamiento después de filtrar
    this.ordenarLista();
  }

  ordenarLista() {
    if (this.orden === "nombre") {
      this.cryptosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (this.orden === "nombre_desc") {
      this.cryptosFiltrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
    } else if (this.orden === "precio") {
      this.cryptosFiltrados.sort((a, b) => a.precio - b.precio);
    } else if (this.orden === "precio_desc") {
      this.cryptosFiltrados.sort((a, b) => b.precio - a.precio);
    }
  }


  verDetalle(nombre: string) {
    this.router.navigate(['/cryptos', nombre]);
  }
}
