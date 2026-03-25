import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces para tipar las respuestas de la API
export interface StatData {
  _id?: string;
  Name?: string;
  'WHO Region'?: string;
  'Cases - cumulative total'?: number;
  'Cases - cumulative total per 100000 population'?: number;
  'Deaths - cumulative total'?: number;
  totalCases?: number; // Usado en agrupaciones
  rate?: number; // Usado en comparativas
  cases?: number; // Proyecciones
  deaths?: number; // Proyecciones
}

@Injectable({
  providedIn: 'root'
})
export class Api {
  private http = inject(HttpClient);
  // URL base del backend Express (asumiendo que corre en localhost p.3000)
  private baseUrl = 'http://localhost:3000/api/stats';

  // 1. Top 10 Países con más casos
  getTop10(): Observable<StatData[]> {
    return this.http.get<StatData[]>(`${this.baseUrl}/top10`);
  }

  // 2. Distribución por Región (Casos totales)
  getRegionDistribution(): Observable<StatData[]> {
    return this.http.get<StatData[]>(`${this.baseUrl}/region-distribution`);
  }

  // 3. Análisis de Ecuador
  getEcuadorData(): Observable<StatData> {
    return this.http.get<StatData>(`${this.baseUrl}/ecuador`);
  }

  // 4. Comparativa de Tasas
  getRateComparison(): Observable<StatData[]> {
    return this.http.get<StatData[]>(`${this.baseUrl}/rate-comparison`);
  }

  // 5. Mortalidad Global
  getGlobalMortality(): Observable<StatData[]> {
    return this.http.get<StatData[]>(`${this.baseUrl}/global-mortality`);
  }
}
