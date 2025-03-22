import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsService } from './alerts.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.scss'
})
export class AlertsComponent implements OnInit {
  alerts: any[] = [];
  newAlert = { crypto: '', condition: '', price: '' };
  errorMessage: string = '';

  private alertsService = inject(AlertsService);
  private router = inject(Router);

  ngOnInit() {
    this.loadAlerts();
  }

  loadAlerts() {
    this.alertsService.getAlerts().subscribe({
      next: (data) => (this.alerts = data),
      error: (err) => (this.errorMessage = 'Error al cargar alertas')
    });
  }

  createAlert() {
    this.alertsService.createAlert(this.newAlert).subscribe({
      next: () => {
        this.newAlert = { crypto: '', condition: '', price: '' };
        this.loadAlerts();
      },
      error: () => (this.errorMessage = 'Error al crear alerta')
    });
  }

  deleteAlert(id: number) {
    this.alertsService.deleteAlert(id).subscribe({
      next: () => this.loadAlerts(),
      error: () => (this.errorMessage = 'Error al eliminar alerta')
    });
  }
}
