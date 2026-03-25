import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CovidService } from '../../services/covid.service';

@Component({
  selector: 'app-region',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './region.html',
  styleUrl: './region.css'
})
export class RegionComponent implements OnInit {
  private covidService = inject(CovidService);
  private cdr = inject(ChangeDetectorRef);
  private sanitizer = inject(DomSanitizer);

  public regionesData: any[] = [];
  public comparativaAndina: any[] = [];
  public isLoading = true;

  // Filtros de Tablas
  public searchRegion = '';
  public searchAndina = '';

  // Filtros de Gráficos (Charts)
  public filterContagios = '';
  public filterContinente = '';

  // IDs de Charts en Atlas
  private baseUrls = {
    contagios: 'https://charts.mongodb.com/charts-reserva_canchas-peftlrd/embed/charts?id=e5467403-08d1-46aa-8a2e-e781fce5de96&maxDataAge=14400&theme=light&autoRefresh=true',
    continente: 'https://charts.mongodb.com/charts-reserva_canchas-peftlrd/embed/charts?id=4cb7a2ae-71bc-4bbd-a510-aa067937fe33&maxDataAge=14400&theme=light&autoRefresh=true'
  };

  ngOnInit() {
    this.loadData();
  }

  getSafeUrl(type: 'contagios' | 'continente', filterText: string): SafeResourceUrl {
    let url = this.baseUrls[type];
    if (filterText && filterText.trim() !== '') {
      // Para el Top 10 usamos 'Name', para el continente usamos 'WHO Region'
      const field = type === 'contagios' ? 'Name' : 'WHO Region';
      const filterObj = {
        [field]: { "$regex": filterText, "$options": "i" }
      };
      url += `&filter=${encodeURIComponent(JSON.stringify(filterObj))}`;
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  get filteredRegiones() {
    return this.regionesData.filter(r => 
      (r.Region || r._id || '').toLowerCase().includes(this.searchRegion.toLowerCase())
    );
  }

  get filteredAndina() {
    return this.comparativaAndina.filter(p => 
      (p.Pais || p.Country || p.Name || '').toLowerCase().includes(this.searchAndina.toLowerCase())
    );
  }

  loadData() {
    this.isLoading = true;
    this.covidService.getRegiones().subscribe({
      next: (data) => {
        this.regionesData = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.isLoading = false; this.cdr.detectChanges(); }
    });
    this.covidService.getComparativaAndina().subscribe(data => {
      this.comparativaAndina = data;
      this.cdr.detectChanges();
    });
    setTimeout(() => { this.isLoading = false; this.cdr.detectChanges(); }, 5000);
  }
}
