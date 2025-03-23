import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertsService } from '../alerts.service';

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.scss']
})
export class AlertListComponent {
  private alertService = inject(AlertsService);
  private router = inject(Router);

  alertas: any[] = [];

  constructor() {
    this.cargarAlertas();
  }

  cargarAlertas() {
    this.alertService.getAlerts().subscribe({
      next: (data) => this.alertas = data,
      error: (err) => console.error("Error al obtener alertas:", err)
    });
  }

  eliminarAlerta(id: number) {
    this.alertService.deleteAlert(id).subscribe({
      next: () => this.cargarAlertas(),
      error: (err) => console.error("Error al eliminar alerta:", err)
    });
  }

  goToCreateAlert() {
    this.router.navigate(['/alerts/create']); // Redirigir al formulario de creación
  }
}
