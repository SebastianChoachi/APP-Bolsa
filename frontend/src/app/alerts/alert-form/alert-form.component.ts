import { Component, inject, OnInit } from '@angular/core';
import { AlertsService } from '../alerts.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alert-form',
  standalone: true,
  templateUrl: './alert-form.component.html',
  styleUrls: ['./alert-form.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class AlertFormComponent implements OnInit {
  private alertsService = inject(AlertsService);
  private http = inject(HttpClient);
  private router = inject(Router);

  cryptos: any[] = [];
  alertData = {
    crypto_name: '',
    condicion: 'mayor igual',
    precio: ''
  };

  ngOnInit() {
    this.loadCryptos();
  }

  loadCryptos() {
    this.http.get<any[]>('http://localhost:5000/cryptos').subscribe(data => {
      this.cryptos = data;
    });
  }

  createAlert() {
    this.alertsService.createAlert(this.alertData).subscribe(() => {
      this.router.navigate(['/alerts']);
    });
  }
}
