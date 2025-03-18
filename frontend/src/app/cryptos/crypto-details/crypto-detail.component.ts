import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-crypto-detail',
  standalone: true,
  template: `
    <div class="container">
      <h2>Detalle de {{ nombreCripto }}</h2>
      <div class="buttons">
        <button (click)="cambiarPeriodo(30)">Últimos 30 días</button>
        <button (click)="cambiarPeriodo(60)">Últimos 60 días</button>
        <button (click)="cambiarPeriodo(90)">Últimos 90 días</button>
      </div>
      <div class="chart-container">
        <canvas id="cryptoChart"></canvas>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        width: 100%;
        max-width: 1200px;
        margin: auto;
        text-align: center;
      }
      .buttons {
        margin-bottom: 20px;
      }
      button {
        margin: 5px;
        padding: 8px 12px;
        border: none;
        background-color: #4CAF50;
        color: white;
        cursor: pointer;
      }
      button:hover {
        background-color: #45a049;
      }
      .chart-container {
        width: 100%;
        height: 500px; /* Ajusta la altura del contenedor */
        display: flex;
        justify-content: center;
        align-items: center;
      }
      canvas {
        width: 100% !important;
        height: 100% !important;
      }
    `
  ]
})
export class CryptoDetailComponent {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  nombreCripto: string = '';
  chart: any;
  periodo: number = 30;

  constructor() {
    this.nombreCripto = this.route.snapshot.paramMap.get('nombre') || '';
    this.obtenerDatosHistoricos();
  }

  cambiarPeriodo(dias: number) {
    this.periodo = dias;
    this.obtenerDatosHistoricos();
  }

  obtenerDatosHistoricos() {
    this.http.get<any>(`http://localhost:5000/cryptos/${this.nombreCripto}?days=${this.periodo}`).subscribe((data) => {
      const fechas = data.prices.map((p: any) => new Date(p[0]).toLocaleDateString());
      const precios = data.prices.map((p: any) => p[1]);
      this.generarGrafico(fechas, precios);
    });
  }

  generarGrafico(fechas: string[], precios: number[]) {
    const ctx = document.getElementById('cryptoChart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: fechas,
        datasets: [{
          label: `Precio de ${this.nombreCripto} (USD)`,
          data: precios,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}
