import { NotificationsWidget } from '@/pages/dashboard/components/notificationswidget';
import { RevenueStreamWidget } from '@/pages/dashboard/components/revenuestreamwidget';
import { StatsWidget } from '@/pages/dashboard/components/statswidget';
import { Component } from '@angular/core';
import { PacientesRecientesWidget } from '../widgets/pacientes-recientes-widget/pacientes-recientes-widget';
import { PacientesPendientesWidget } from '../widgets/pacientes-pendientes-widget/pacientes-pendientes-widget';


@Component({
  selector: 'app-panel-control',
  imports: [StatsWidget, PacientesRecientesWidget, PacientesPendientesWidget, RevenueStreamWidget, NotificationsWidget],
  templateUrl: './panel-control.html',
  styleUrl: './panel-control.scss'
})
export class PanelControl {

}
