import { PacienteDto } from '@/core/dtos/paciente.dto';
import { MonitoreoService } from '@/core/services/monitoreo.service';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { addDays } from "date-fns";
import { CitaDto } from '@/core/dtos/cita.dto';
import { CitaSerivce } from '@/core/services/cita.service';
import { TratamientoDto } from '@/core/dtos/tratamiento.dto';
import { DetailCita } from '@/modules/tratamiento/citas-tratamiento/datail-cita/detail-cita';

@Component({
  selector: 'app-pacientes-pendientes-widget',
  imports: [CommonModule, TableModule, ButtonModule, RippleModule, DetailCita],
  templateUrl: './pacientes-pendientes-widget.html',
  styleUrl: './pacientes-pendientes-widget.scss'
})
export class PacientesPendientesWidget {
    citas!: CitaDto[];
    monitoreoService = inject(MonitoreoService);

    citaDialogVisible: boolean = false;
    citaSelected!: CitaDto;
    citaSubmitted = signal(false);
    citaService = inject(CitaSerivce);
    tratamientoSeleccionado: TratamientoDto = this.getDefaultTratamiento();


  ngOnInit() {
    this.loadPacientesPendientes();
  }

  loadPacientesPendientes(){
    this.monitoreoService.getPacientesPendientes().subscribe({
      next: resp => {
        this.citas = resp.data;
      }
    });
  }

  registrarCita(cita: CitaDto){
    cita.fecha_actual = new Date();
    cita.fecha_programada = new Date(cita.fecha_programada!)

    this.tratamientoSeleccionado = cita.tratamiento!;
    this.citaSelected = cita;
    this.citaDialogVisible = true;
    this.citaSubmitted.set(false);
  }

  saveCita(){
    console.log("guardando cita", this.citaSelected);
    this.citaSubmitted.set(true);
    this.citaService.crearCitaTratamiento(this.citaSelected).subscribe({
      next: (response)=> {
        console.log("cita creada ...", response.data);
        this.citaSubmitted.set(false);
        this.citaDialogVisible = false;
        this.citaSelected = this.getDefaultCita('');
      },
      error: error => {
        console.log("error al craer cita...", error);
      }
    });
  }


  getDefaultCita(tratamientoId: string): CitaDto {
    const today = new Date();
    // Formato MM-DD-YYYY
    const pad = (n: number) => n.toString().padStart(2, '0');
    const formattedDate = `${pad(today.getMonth() + 1)}-${pad(today.getDate())}-${today.getFullYear()}`;
    return {
      idTratamiento: tratamientoId,
      fecha_programada: today,
      fecha_actual: today,
      idEstado: 'default-estado',
      idTipo: 'default-tipo',
      observaciones: '',
      idUser: 'default-user'
    };
  }

  hideDialogCita(){
    this.citaSubmitted.set(false);
    this.citaDialogVisible = false;
    this.citaSelected = this.getDefaultCita('');
  }

  getDefaultTratamiento(): TratamientoDto{
    return {
      paciente: {}
    }
  }
}
