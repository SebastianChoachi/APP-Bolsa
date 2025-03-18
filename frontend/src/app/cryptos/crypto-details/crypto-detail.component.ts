import { Component, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
      <canvas #cryptoChart></canvas>
    </div>
  `,
  styles: [
    `
      .container {
        width: 80%;
        margin: auto;
        text-align: center;
      }
      canvas {
        max-width: 700px;
        height: 400px !important;
        margin-top: 20px;
      }
    `
  ]
})
export class CryptoDetailComponent implements AfterViewInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  @ViewChild('cryptoChart') cryptoChart!: ElementRef<HTMLCanvasElement>;

  nombreCripto: string = '';
  chart: any;

  constructor() {
    this.nombreCripto = this.route.snapshot.paramMap.get('nombre') || '';
  }

  ngAfterViewInit() {
    this.obtenerDatosHistoricos();
  }

  obtenerDatosHistoricos() {
    this.http.get<any>(`http://localhost:5000/cryptos/${this.nombreCripto}`).subscribe((data) => {
      if (!data.market_caps) {
        console.error('No se encontraron datos de market_caps.');
        return;
      }

      // Extraer timestamps y precios
      const fechas = data.market_caps.map((p: any) => new Date(p[0]).toLocaleDateString());
      const precios = data.market_caps.map((p: any) => p[1]);

      this.generarGrafico(fechas, precios);
    });
  }

  generarGrafico(fechas: string[], precios: number[]) {
    const ctx = this.cryptoChart.nativeElement.getContext('2d');

    if (this.chart) {
      this.chart.destroy(); // Evita gráficos duplicados
    }

    this.chart = new Chart(ctx!, {
      type: 'line',
      data: {
        labels: fechas,
        datasets: [{
          label: `Precio de ${this.nombreCripto} (USD)`,
          data: precios,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 2, // Ajusta la proporción ancho-alto
        scales: {
          x: { display: true },
          y: { display: true }
        }
      }
    });
  }
}
