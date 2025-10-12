import { EstadoCitaDto} from '@/core/dtos/estadocita.dto';
import { TipoCitaDto } from '@/core/dtos/tipocita.dto';
import { TratamientoSerivce } from '@/core/services/tratamiento.service';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CitaDto } from '@/core/dtos/cita.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { Button } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { CitaSerivce } from '@/core/services/cita.service';
import { MotivoDto } from '@/core/dtos/motivo.dto';

const estadoCitaInasistencia = ['Perdido', 'Cancelado'];

@Component({
  selector: 'app-detail-cita',
  imports: [Button, FormsModule, DialogModule, CommonModule, InputTextModule, InputNumberModule, InputIconModule,
    CheckboxModule, SelectModule,DatePickerModule, IftaLabelModule, TextareaModule],
  templateUrl: './detail-cita.html',
  styleUrl: './detail-cita.scss'
})
export class DetailCita {
  @Input() visible = false;
  @Input() tratamientoId!: string;
  @Input() submitted = false;
  @Input() cita!: CitaDto;

  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  tratamientoService = inject(TratamientoSerivce);
  citaService = inject(CitaSerivce);

  tipoCitaOptions = signal<TipoCitaDto[]>([]);
  tipoCitaSelected: string = '';

  estadoCitaOptions = signal<EstadoCitaDto[]>([]);
  estadoCitaSelected: string = '';  

  motivoInasistenciaOptions = signal<MotivoDto[]>([]);
  motivoSelected: string = '';
  isInasistencia: boolean = false;

  ngOnInit() {
    this.loadtipoCitaOptions();
    this.loadEstadoCitaOptions();
  }

  onSave(){
    this.cita.idEstado = this.estadoCitaSelected;
    this.cita.idTipo = this.tipoCitaSelected;
    this.cita.idMotivo = this.motivoSelected;
    this.save.emit();
  }

  onCancel(){
    this.cancel.emit();
  }

  onDialogShow(){
    if(this.cita.id){
      this.tipoCitaSelected = this.cita.idTipo || '';
      this.estadoCitaSelected = this.cita.idEstado || '';
    }else{
      this.cita.idTipo = this.tipoCitaSelected;
      this.cita.idEstado = this.estadoCitaSelected;
    }
  }

  loadtipoCitaOptions(){
    this.citaService.getAllTipoCita().subscribe({
      next: (response) => {
        if(response.data){
          let citas = response.data;
          this.tipoCitaOptions.set(response.data);
          this.tipoCitaSelected = citas[0].id  || ''
        }
      },
      error: (error) => {
        console.error('Error fetching tipoCita options:', error);
      }
    });
  }

  loadEstadoCitaOptions(){
    this.citaService.getAllEstadoCita().subscribe({
      next: (response) => {
        if(response.data){
          let estados = response.data;
          this.estadoCitaOptions.set(response.data);
          this.estadoCitaSelected = estados[0].id  || ''
        }
      }
    });
  }

  onEstadoCitaChange(event: SelectChangeEvent){
    let idEstado = event.value;
    let estado = this.estadoCitaOptions().find(e => e.id === idEstado);
    if(estado){
      if(estadoCitaInasistencia.includes(estado.descripcion!)){
        this.isInasistencia = true;

        this.loadMotivoOptions();
      }else{
        this.isInasistencia = false;

        this.motivoInasistenciaOptions.set([]);
        this.motivoSelected = '';
      }
    }
  }


  loadMotivoOptions(){
    this.citaService.getAllMotivo().subscribe({
      next: (response) => {
        if(response.data){
          this.motivoInasistenciaOptions.set(response.data);
        }
      }
    });
  }
  
}
