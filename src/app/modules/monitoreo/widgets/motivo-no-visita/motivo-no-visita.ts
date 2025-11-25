import { LayoutService } from '@/layout/service/layout.service';
import { Component, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { MonitoreoService } from '@/core/services/monitoreo.service';

@Component({
  selector: 'app-motivo-no-visita',
  imports: [ChartModule],
  templateUrl: './motivo-no-visita.html',
  styleUrl: './motivo-no-visita.scss'
})
export class MotivoNoVisita {

  chartData: any;

  chartOptions: any;

  subscription!: Subscription;
  totalCitas: number = 0;

  private monitoreoService = inject(MonitoreoService);

  constructor(public layoutService: LayoutService) {
    this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => {
      this.loadReport();
    });
  }

  ngOnInit() {
    this.loadReport();
  }
  loadReport(fechaInicio?: Date, fechaFin?: Date) {
    // Default to last 7 days if no range provided
    const hoy = new Date();
    const fin = fechaFin || new Date(hoy.getFullYear(), 11, 31, 23, 59, 59, 999); // 31 dic 23:59:59
    const inicio = fechaInicio || new Date(hoy.getFullYear(), 0, 1, 0, 0, 0, 0);   // 1 ene 00:00:00

    this.monitoreoService.getMotivoDeNoVisitaReporte(inicio, fin).subscribe({
      next: (resp: any) => {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

        const data = resp.data || { motivos: [], total_citas: 0 };
        this.totalCitas = data.total_citas || 0;
        const motivos = data.motivos || [];

        const labels = motivos.map((m: any) => m.motivo);
        const values = motivos.map((m: any) => m.cantidad);

        this.chartData = {
          labels: labels,
          datasets: [
            {
              type: 'bar',
              label: 'Motivos',
              backgroundColor: documentStyle.getPropertyValue('--p-primary-400') || '#42a5f5',
              data: values,
              borderRadius: 8,
              borderSkipped: false,
              barThickness: 32
            }
          ]
        };

        this.chartOptions = {
          maintainAspectRatio: false,
          aspectRatio: 0.8,
          plugins: {
            legend: {
              labels: {
                color: textColor
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
      },
      error: (err: any) => {
        console.error('Error cargando reporte motivo no visita', err);
        // fallback: empty chart
        this.chartData = { labels: [], datasets: [] };
        this.chartOptions = {};
        this.totalCitas = 0;
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
