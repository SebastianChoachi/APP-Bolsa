import { Component, inject, OnInit } from '@angular/core';
import { AlertsService } from '../alerts.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alert-list',
  standalone: true,
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class AlertListComponent implements OnInit {
  private alertsService = inject(AlertsService);
  private router = inject(Router);
  alerts: any[] = [];

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);  // Redirige si no hay token
      return;
    }

    this.loadAlerts();
  }

  loadAlerts() {
    this.alertsService.getAlerts().subscribe({
      next: (data) => this.alerts = data,
      error: (err) => {
        console.error('Error al obtener alertas:', err);
        if (err.status === 401) {
          this.router.navigate(['/login']); // Si no está autorizado, redirigir a login
        }
      }
    });
  }

  deleteAlert(alertId: number) {
    this.alertsService.deleteAlert(alertId).subscribe(() => {
      this.alerts = this.alerts.filter(alert => alert.id !== alertId);
    });
  }

  goToCreateAlert() {
    this.router.navigate(['/alerts/create']);
  }
}
