import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private apiUrl = 'http://127.0.0.1:5000/cryptos';

  constructor(private http: HttpClient) {}

  getCryptos(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
