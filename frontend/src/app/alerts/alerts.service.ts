import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  private apiUrl = 'http://localhost:5000/alerts';
  private http = inject(HttpClient);

  getAlerts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createAlert(alert: any): Observable<any> {
    return this.http.post(this.apiUrl, alert);
  }

  deleteAlert(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
