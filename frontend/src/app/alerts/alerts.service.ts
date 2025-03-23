import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/alerts/';

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');  // Obtener token del localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAlerts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  createAlert(alertData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, alertData, { headers: this.getAuthHeaders() });
  }

  deleteAlert(alertId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${alertId}`, { headers: this.getAuthHeaders() });
  }
}
