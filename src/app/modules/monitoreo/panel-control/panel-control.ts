import { NotificationsWidget } from '@/pages/dashboard/components/notificationswidget';
import { RevenueStreamWidget } from '@/pages/dashboard/components/revenuestreamwidget';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatWidget } from '../widgets/stat-widget/stat-widget';
import { PacientesRecientesWidget } from '../widgets/pacientes-recientes-widget/pacientes-recientes-widget';
import { PacientesPendientesWidget } from '../widgets/pacientes-pendientes-widget/pacientes-pendientes-widget';
import { MonitoreoService } from '@/core/services/monitoreo.service';
import { IncidenciaTbDto } from '@/core/dtos/incidencias-tb.dto';


@Component({
  selector: 'app-panel-control',
  imports: [CommonModule, StatWidget, PacientesRecientesWidget, PacientesPendientesWidget, RevenueStreamWidget, NotificationsWidget],
  templateUrl: './panel-control.html',
  styleUrl: './panel-control.scss'
})
export class PanelControl {
  private monitoreoService = inject(MonitoreoService);

  indicadores: IncidenciaTbDto[] = [];

  ngOnInit(): void {
    this.loadIndicadores();
  }

  loadIndicadores(): void {
    this.monitoreoService.getIndicadoresEvaluacion().subscribe({
      next: (response) => {
        this.indicadores = response.data || [];
      },
      error: (err) => {
        console.error('Error cargando indicadores de evaluación', err);
        this.indicadores = [];
      }
    });
  }

}


