import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private http = inject(HttpClient);
  // URL base del backend Express
  private apiUrl = 'http://localhost:3000/api/stats';

  constructor() { }

  getGlobalStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/global`);
  }

  getEcuadorStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ecuador`);
  }

  getTop10Stats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/top10`);
  }
}
