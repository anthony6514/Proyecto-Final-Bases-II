import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CovidService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  constructor() { }

  getEcuador(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/ecuador`);
  }

  getTopMuertes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-muertes`);
  }

  getRegiones(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/regiones`);
  }

  getComparativaAndina(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/comparativa-andina`);
  }

  getLetalidad(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/letalidad`);
  }

  getStatsRegion(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stats-region`);
  }
}
