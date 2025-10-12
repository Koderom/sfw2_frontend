import { PacienteDto } from '@/core/dtos/paciente.dto';
import { MonitoreoService } from '@/core/services/monitoreo.service';
import { Product, ProductService } from '@/pages/service/product.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { addDays } from "date-fns";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-pacientes-recientes-widget',
  imports: [CommonModule, TableModule, ButtonModule, RippleModule],
  templateUrl: './pacientes-recientes-widget.html',
  styleUrl: './pacientes-recientes-widget.scss',
  providers: [ProductService]
})
export class PacientesRecientesWidget {
    pacientes!: PacienteDto[];
    monitoreoService = inject(MonitoreoService);

    _router = inject(Router);
    _route = inject(ActivatedRoute);

    ngOnInit() {
      this.loadPacientesRecientes();
    }

    loadPacientesRecientes(){
      let now = new Date();
      let fechaInicio = new Date(now.getFullYear(), now.getMonth(), 1);
      let fechaFin = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      fechaFin = addDays(fechaFin, -1);

      this.monitoreoService.getPacientesRecientes(fechaInicio, fechaFin).subscribe({
        next: resp => {
          this.pacientes = resp.data;
        }
      });
    }

    editPaciente(paciente: PacienteDto) {
      this._router.navigate(['pacientes/detail-paciente', paciente.id] );
    }
}
