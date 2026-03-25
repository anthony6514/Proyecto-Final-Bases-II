import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CovidService } from '../../services/covid.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private covidService = inject(CovidService);
  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);

  public ecuadorData: any = null;
  public topMuertes: any[] = [];
  public comparativaAndina: any[] = [];
  public letalidad: any[] = [];
  public statsRegion: any[] = [];
  public isLoading = true;

  // Filtros de Tablas
  public searchTop = '';
  public searchAndina = '';
  public searchLetalidad = '';
  public searchRegion = '';

  // Filtros de Gráficos (Charts)
  public filterMap = '';
  public filterIncidencia = '';
  public filterMuertesChart = '';

  // IDs de Charts (Extraídos del HTML)
  private baseUrls = {
    map: 'https://charts.mongodb.com/charts-reserva_canchas-peftlrd/embed/charts?id=7333d686-d89f-4449-8d6c-bbfc8f73900a&maxDataAge=14400&theme=light&autoRefresh=true',
    incidencia: 'https://charts.mongodb.com/charts-reserva_canchas-peftlrd/embed/charts?id=81e00bb0-0b46-4a9c-b68b-5a0f6993056a&maxDataAge=14400&theme=light&autoRefresh=true',
    muertes: 'https://charts.mongodb.com/charts-reserva_canchas-peftlrd/embed/charts?id=6d35e5f8-f099-46bb-b367-e56aea92dc06&maxDataAge=14400&theme=light&autoRefresh=true'
  };

  ngOnInit() {
    this.loadData();
  }

  getSafeUrl(type: 'map' | 'incidencia' | 'muertes', filterText: string): SafeResourceUrl {
    let url = this.baseUrls[type];
    if (filterText && filterText.trim() !== '') {
      // Usamos Regex para que no importe mayúsculas/minúsculas y buscamos por campo específico
      const field = type === 'muertes' ? 'Pais' : 'Name'; 
      const filterObj = { 
        [field]: { "$regex": filterText, "$options": "i" }
      };
      url += `&filter=${encodeURIComponent(JSON.stringify(filterObj))}`;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // Getters para filtrado de tablas
  get filteredTopMuertes() {
    return this.topMuertes.filter(p => (p.Pais || p.Country || '').toLowerCase().includes(this.searchTop.toLowerCase()));
  }
  get filteredAndina() {
    return this.comparativaAndina.filter(p => (p.Pais || p.Country || '').toLowerCase().includes(this.searchAndina.toLowerCase()));
  }
  get filteredLetalidad() {
    return this.letalidad.filter(p => (p.Pais || p.Country || '').toLowerCase().includes(this.searchLetalidad.toLowerCase()));
  }
  get filteredStatsRegion() {
    return this.statsRegion.filter(p => (p.Pais || '').toLowerCase().includes(this.searchRegion.toLowerCase()) || (p.Region || '').toLowerCase().includes(this.searchRegion.toLowerCase()));
  }

  loadData() {
    this.isLoading = true;
    const handleNext = (key: string, data: any) => { (this as any)[key] = data; this.cdr.detectChanges(); };

    this.covidService.getEcuador().subscribe(data => { this.ecuadorData = data[0]; this.cdr.detectChanges(); });
    this.covidService.getTopMuertes().subscribe(data => { this.topMuertes = data; this.cdr.detectChanges(); });
    this.covidService.getComparativaAndina().subscribe(data => { this.comparativaAndina = data; this.cdr.detectChanges(); });
    this.covidService.getLetalidad().subscribe(data => { this.letalidad = data; this.cdr.detectChanges(); });
    this.covidService.getStatsRegion().subscribe({
      next: (data) => { this.statsRegion = data; this.isLoading = false; this.cdr.detectChanges(); },
      error: () => this.isLoading = false
    });

    setTimeout(() => { this.isLoading = false; this.cdr.detectChanges(); }, 6000);
  }
}
