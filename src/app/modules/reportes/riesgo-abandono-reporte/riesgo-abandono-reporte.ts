import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { MonitoreoService } from '@/core/services/monitoreo.service';
import { RiesgoAbandonoDto } from '@/core/dtos/riesgo-abandono.dto';
import { LayoutService } from '@/layout/service/layout.service';
import { debounceTime, Subscription } from 'rxjs';

@Component({
  selector: 'app-riesgo-abandono-reporte',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ChartModule, CardModule, SkeletonModule, InputIconModule, IconFieldModule, InputTextModule, TagModule, DatePickerModule, ButtonModule],
  templateUrl: './riesgo-abandono-reporte.html',
  styleUrl: './riesgo-abandono-reporte.scss'
})
export class RiesgoAbandonoReporte implements OnInit, OnDestroy {
  private monitoreoService = inject(MonitoreoService);
  public layoutService = inject(LayoutService);

  reportData: RiesgoAbandonoDto[] = [];
  loading: boolean = true;
  chartData: any;
  chartOptions: any;
  
  fechaInicio: Date | null = null;
  fechaFin: Date | null = null;
  minDate: Date = new Date(new Date().getFullYear(), 0, 1);
  maxDate: Date = new Date();
  
  subscription!: Subscription;

  ngOnInit(): void {
    this.initializeDateRange();
    this.loadReport();
    this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => {
      this.initChart();
    });
  }

  initializeDateRange(): void {
    const now = new Date();
    this.fechaFin = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    this.fechaInicio = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  loadReport(): void {
    this.loading = true;
    this.monitoreoService.getRiesgoAbandonoReporte(this.fechaInicio || new Date(), this.fechaFin || new Date()).subscribe({
      next: (resp: any) => {
        this.reportData = resp.data || [];
        this.loading = false;
        this.initChart();
      },
      error: (err: any) => {
        console.error('Error cargando reporte riesgo abandono', err);
        this.reportData = [];
        this.loading = false;
      }
    });
  }

  initChart(): void {
    if (this.reportData.length === 0) {
      this.chartData = { labels: [], datasets: [] };
      this.chartOptions = {};
      return;
    }

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

    // Calcular nivel para cada paciente basado en riskScore
    const nivelCount: { [key: string]: number } = {
      'Bajo': 0,
      'Moderado': 0,
      'Alto': 0,
      'Muy Alto': 0
    };

    this.reportData.forEach((item) => {
      const riskScore = item.metricas?.riskScore || 0;
      let nivel = 'Bajo';
      if (riskScore > 0.75) nivel = 'Muy Alto';
      else if (riskScore > 0.5) nivel = 'Alto';
      else if (riskScore > 0.25) nivel = 'Moderado';
      
      nivelCount[nivel]++;
    });

    const labels = Object.keys(nivelCount);
    const values = Object.values(nivelCount);

    // Colores por nivel
    const colors: { [key: string]: string } = {
      'Bajo': documentStyle.getPropertyValue('--p-green-400') || '#4caf50',
      'Moderado': documentStyle.getPropertyValue('--p-yellow-400') || '#ffc107',
      'Alto': documentStyle.getPropertyValue('--p-orange-400') || '#ff9800',
      'Muy Alto': documentStyle.getPropertyValue('--p-red-400') || '#f44336'
    };

    const backgroundColors = labels.map(label => colors[label] || '#42a5f5');

    // Mes actual
    const now = new Date();
    const monthName = now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

    this.chartData = {
      labels: labels,
      datasets: [
        {
          label: `Pacientes por Nivel - ${monthName}`,
          data: values,
          backgroundColor: backgroundColors,
          borderRadius: 8
        }
      ]
    };

    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: { color: textColor }
        },
        tooltip: {
          callbacks: {
            afterLabel: (context: any) => {
              const nivel = context.label;
              const riskRanges: { [key: string]: string } = {
                'Bajo': 'Rango: 0 - 0.25',
                'Moderado': 'Rango: 0.25 - 0.50',
                'Alto': 'Rango: 0.50 - 0.75',
                'Muy Alto': 'Rango: > 0.75'
              };
              return riskRanges[nivel] || '';
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: textMutedColor },
          grid: { color: 'transparent', borderColor: 'transparent' }
        },
        y: {
          ticks: { color: textMutedColor },
          grid: { color: borderColor, borderColor: 'transparent', drawTicks: false }
        }
      }
    };
  }

  getNivelSeverity(nivel?: string): string {
    switch (nivel) {
      case 'Muy Alto':
        return 'danger';
      case 'Alto':
        return 'danger';
      case 'Moderado':
        return 'warning';
      case 'Bajo':
        return 'success';
      default:
        return 'info';
    }
  }

  calculateNivel(riskScore?: number): string {
    const score = riskScore || 0;
    if (score > 0.75) return 'Muy Alto';
    if (score > 0.5) return 'Alto';
    if (score > 0.25) return 'Moderado';
    return 'Bajo';
  }

  formatDateToString(date: Date | null): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
