import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CovidService } from '../../services/covid.service';

@Component({
  selector: 'app-ecuador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ecuador.html',
  styleUrl: './ecuador.css'
})
export class EcuadorComponent implements OnInit {
  private covidService = inject(CovidService);
  private cdr = inject(ChangeDetectorRef);
  
  public data: any = null;
  public isLoading = true;
  public errorMsg = '';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.errorMsg = '';
    console.log('--- Cargando datos de Ecuador ---');

    this.covidService.getEcuador().subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.data = res[0];
          console.log('✅ Datos Ecuador:', this.data);
          this.cdr.detectChanges();
        } else {
          console.warn('⚠️ No se encontraron datos para Ecuador');
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error en /api/ecuador:', err);
        this.errorMsg = 'Error al cargar los datos de Ecuador.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });

    // Timeout de seguridad
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.detectChanges();
    }, 5000);
  }
}
