import { Component, inject, Input, OnInit,signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ActivatedRoute } from '@angular/router';
import { CitaDto } from '@/core/dtos/cita.dto';
import { CitaSerivce } from '@/core/services/cita.service';
import { TratamientoDto } from '@/core/dtos/tratamiento.dto';
import { TratamientoSerivce } from '@/core/services/tratamiento.service';
import { DetailCita } from './datail-cita/detail-cita';
import { DividerModule } from 'primeng/divider';
import { Toast } from 'primeng/toast';
import { Ripple } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import ToastMessage from '@/core/utils/ui/toast-message';

interface Cita {
  titulo: string;
  hora: string;
  estado?: string;
}

interface DiaCalendario {
  fecha: Date;
  citas: Cita[];
  disponible: boolean;
}

@Component({
  selector: 'app-citas-tratamiento',
  imports: [CommonModule, PanelModule, ButtonModule, CardModule, DividerModule, DetailCita, Toast
  ],
  templateUrl: './citas-tratamiento.html',
  styleUrl: './citas-tratamiento.scss',
  providers: [MessageService]
})
export class CitasTratamiento {
  constructor(private messageService: MessageService) {}

  @Input() tratamientoId:string = '';
  tratamiento = signal<TratamientoDto>(this.getDefaultTratamiento());
  tratamientoService = inject(TratamientoSerivce);

  diasDelMes: DiaCalendario[] = [];
  mesActual: number = new Date().getMonth();
  anioActual: number = new Date().getFullYear();

  get minDate(): Date {
    const fecha = this.tratamiento()?.fecha_inicio;
    if (!fecha) return new Date();
    return fecha instanceof Date ? fecha : new Date(fecha);
  }
  get maxDate(): Date {
    const fecha = this.tratamiento()?.fecha_fin;
    if (!fecha) return new Date();
    return fecha instanceof Date ? fecha : new Date(fecha);
  }
  route = inject(ActivatedRoute);

  citasTratamiento = signal<CitaDto[]>([]);
  citaService = inject(CitaSerivce);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const tratamientoId = params.get('id');
      this.tratamientoId = tratamientoId || '';
    });
    this.loadTratamiento();
  }

  loadTratamiento(){
    this.tratamientoService.getTratamientoById(this.tratamientoId).subscribe({
      next: response => {
        this.tratamiento.set(response.data);
        // Mostrar por defecto el mes del día actual si está en rango, si no, el último mes del rango
        const minDate = this.minDate;
        const maxDate = this.maxDate;
        const hoy = new Date();
        hoy.setHours(0,0,0,0);
        if (hoy >= minDate && hoy <= maxDate) {
          this.mesActual = hoy.getMonth();
          this.anioActual = hoy.getFullYear();
        } else {
          this.mesActual = maxDate.getMonth();
          this.anioActual = maxDate.getFullYear();
        }
        this.cargarCitasTratamiento();
      },
      error: error => {
        console.error("citas-tratamientos: loadTratamiento -> ", error);
      }
    });
  }

  cargarCitasTratamiento() {
    this.citaService.getAllCitas(this.tratamientoId).subscribe({
      next: response => {
        this.citasTratamiento.set(response.data || []);
        this.generarCalendario();
      },
      error: error => {
        console.error("citas-tratamientos: cargarCitasTratamiento -> ", error);
        this.citasTratamiento.set([]);
        this.generarCalendario();
      }
    });
  }
  get estadoTratamiento(): string {
    const estado = this.tratamiento()?.estado;
    if (estado && estado.descripcion) {
      return estado.descripcion;
    }

    const hoy = new Date();
    const minDate = this.minDate;
    const maxDate = this.maxDate;
    if (hoy < minDate) return 'Pendiente';
    if (hoy > maxDate) return 'Finalizado';
    return 'En curso';
  }



  generarCalendario() {
    this.diasDelMes = [];
    const minDate = this.minDate;
    const maxDate = this.maxDate;
    if (!minDate || !maxDate) return;

    // Mostrar todos los días del mes seleccionado
    const primerDiaMes = new Date(this.anioActual, this.mesActual, 1);
    const ultimoDiaMes = new Date(this.anioActual, this.mesActual + 1, 0);

    let fecha = new Date(primerDiaMes);
    fecha.setHours(0,0,0,0);
    const endDate = new Date(ultimoDiaMes);
    endDate.setHours(0,0,0,0);

    // Indexar citas por fecha (año-mes-día)
    const citasPorDia: { [key: string]: CitaDto[] } = {};
    for (const cita of this.citasTratamiento()) {
      if (!cita.fecha_programada) continue;
      const f = new Date(cita.fecha_programada);
      f.setHours(0,0,0,0);
      const key = `${f.getFullYear()}-${f.getMonth()}-${f.getDate()}`;
      if (!citasPorDia[key]) citasPorDia[key] = [];
      citasPorDia[key].push(cita);
    }

    const hoy = new Date();
    hoy.setHours(0,0,0,0);

    while (fecha <= endDate) {
      const disponible = fecha >= minDate && fecha <= maxDate;
      const key = `${fecha.getFullYear()}-${fecha.getMonth()}-${fecha.getDate()}`;
      let citas: Cita[] = [];
      if (citasPorDia[key] && disponible) {
        // Mostrar todas las citas reales de ese día
        citas = citasPorDia[key].map(cita => ({
          titulo: cita.tipo?.descripcion || 'Cita',
          hora: cita.fecha_actual ? new Date(cita.fecha_actual).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '',
          estado: cita.estado?.descripcion || ''
        }));
      } else if (disponible) {
        // No hay cita registrada para este día
        if (fecha < hoy) {
          citas = [{ titulo: 'Sin cita', hora: '', estado: 'Perdido' }];
        } else {
          citas = [{ titulo: 'Sin cita', hora: '', estado: 'Programado' }];
        }
      }
      this.diasDelMes.push({ fecha: new Date(fecha), citas, disponible });
      fecha.setDate(fecha.getDate() + 1);
    }
  }
  // Utilidad para saber si un día es hoy
  esHoy(dia: Date): boolean {
    const hoy = new Date();
    return dia.getDate() === hoy.getDate() && dia.getMonth() === hoy.getMonth() && dia.getFullYear() === hoy.getFullYear();
  }

  cambiarMes(offset: number) {
    // Cambia el mes solo si hay días válidos en el nuevo mes dentro del rango del tratamiento
    let nuevoMes = this.mesActual + offset;
    let nuevoAnio = this.anioActual;
    if (nuevoMes < 0) {
      nuevoMes = 11;
      nuevoAnio--;
    } else if (nuevoMes > 11) {
      nuevoMes = 0;
      nuevoAnio++;
    }
    // Verificar si el nuevo mes tiene algún día dentro del rango del tratamiento
    const minDate = this.minDate;
    const maxDate = this.maxDate;
    const primerDiaNuevoMes = new Date(nuevoAnio, nuevoMes, 1);
    const ultimoDiaNuevoMes = new Date(nuevoAnio, nuevoMes + 1, 0);
    if (ultimoDiaNuevoMes < minDate || primerDiaNuevoMes > maxDate) {
      // No hay días válidos en ese mes
      return;
    }
    this.mesActual = nuevoMes;
    this.anioActual = nuevoAnio;
    this.generarCalendario();
  }

  get nombreMes(): string {
    // Muestra el mes y año actual
    return new Date(this.anioActual, this.mesActual).toLocaleString('es-ES', {
      month: 'long',
      year: 'numeric'
    });
  }

  getDefaultTratamiento(): TratamientoDto{
    // Por defecto, un rango de 1 semana
    const hoy = new Date();
    const fin = new Date(hoy);
    fin.setDate(hoy.getDate() + 6);
    return {
      fecha_inicio: hoy,
      fecha_fin: fin,
      paciente: {nombre:''}
    }
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


  /*
  *
  * Dialog registro de citas
  * 
  *  */
  citaDialogVisible = false;
  citaSelected: CitaDto = this.getDefaultCita('');
  citaSubmitted = signal(false);
  tratamientoSeleccionadoId:string = ''


  saveCita(){
    console.log("guardando cita", this.citaSelected);
    this.citaSubmitted.set(true);
    this.citaService.crearCitaTratamiento(this.citaSelected).subscribe({
      next: (response)=> {
        console.log("cita creada ...", response.data);
        this.citaSubmitted.set(false);
        this.citaDialogVisible = false;
        this.citaSelected = this.getDefaultCita('');

        ToastMessage.success(this.messageService, 'Registrado', [response.message]);
        this.ngOnInit();
      },
      error: error => {
        console.error("Guardar cita", error);
        ToastMessage.exception(this.messageService, 'Citas', error);
      }
    });
  }

  hideDialogCita(){
    this.citaSelected = this.getDefaultCita('');
    this.citaSubmitted.set(false);
    this.citaDialogVisible = false;
  }
  addCitaDiaMes(fechaSeleccionada?: Date){
    this.citaSelected.idTratamiento = this.tratamiento().id;
    if (fechaSeleccionada) {
      this.citaSelected.fecha_programada = fechaSeleccionada;
    }
    this.citaSubmitted.set(true);
    this.citaDialogVisible = true;
  }
}
