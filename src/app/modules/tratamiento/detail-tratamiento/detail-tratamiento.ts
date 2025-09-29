import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { TratamientoDto } from '@/core/dtos/tratamiento.dto';
import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputIconModule } from 'primeng/inputicon';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { IftaLabelModule } from 'primeng/iftalabel';
import { TextareaModule } from 'primeng/textarea';
import { TratamientoSerivce } from '@/core/services/tratamiento.service';
import { TipoTratamientoDto } from '@/core/dtos/tipotratamiento.dto';
import { EstadoTratamientoDto } from '@/core/dtos/estadotratamiento.dto';
import { Paciente } from '@/modules/paciente';
import { PacienteService } from '@/modules/paciente/paciente.service';
import { PacienteDto } from '@/core/dtos/paciente.dto';
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';

@Component({
  selector: 'app-detail-tratamiento',
  imports: [Button, FormsModule, DialogModule, CommonModule, InputTextModule, InputNumberModule, InputIconModule,
    CheckboxModule, SelectModule,DatePickerModule, IftaLabelModule, TextareaModule, AutoComplete
  ],
  templateUrl: './detail-tratamiento.html',
  styleUrl: './detail-tratamiento.scss'
})
export class DetailTratamiento {
  @Input() visible = false;          
  @Input() tratamiento!: TratamientoDto;
  @Input() submitted = false;

  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  tratamientoService = inject(TratamientoSerivce);
  pacienteService = inject(PacienteService);

  tipoTratamientoOptions = signal<TipoTratamientoDto[]>([]);
  selectedTipoTratamientoId = '';

  estadoTratamientoOptions = signal<EstadoTratamientoDto[]>([]);
  selectedEstadoTratamientoId = '';

  pacienteTratamientoOptions = signal<PacienteDto[]>([]);
  filteredPaciente: PacienteDto[] = [];
  selectedPacienteId : any;

  ngOnInit(){
    this.loadTipoTratamientoOptions();
    this.loadEstadoTratamientoOptions();
    this.loadPacienteTratamientoOptions();
  }

  loadTipoTratamientoOptions(){
    this.tratamientoService.getAllTipoTratamiento().subscribe({
      next: (response) => {
        console.log('Tipo Tratamiento:', response);
        this.tipoTratamientoOptions.set(response.data || []);
        if(response.data && response.data.length > 0){
          this.selectedTipoTratamientoId = response.data[0].id || '';
        }
      }
    });
  }

  loadEstadoTratamientoOptions(){
    this.tratamientoService.getAllEstadoTratamiento().subscribe({
      next: (response) => {
        console.log('Estado Tratamiento:', response);
        this.estadoTratamientoOptions.set(response.data || []);
        if(response.data && response.data.length > 0){
          this.selectedEstadoTratamientoId = response.data[0].id || '';
        }
      }
    });
  }

  loadPacienteTratamientoOptions(){
    this.pacienteService.getAllPacientes().subscribe({
      next: (response) => {
        console.log('Pacientes:', response);
        this.pacienteTratamientoOptions.set(response.data || []);
      }
    });
  }

  onDialogShow(){
    // Para acciones al mostrar el dialog
  }

  onCancel(){
    this.cancel.emit();
  }
  onSave(){
    this.tratamiento.idTipoTratamiento = this.selectedTipoTratamientoId;
    this.tratamiento.idEstado = this.selectedEstadoTratamientoId;
    this.save.emit();
  }


  filterPaciente(event: AutoCompleteCompleteEvent) {
      const filtered: any[] = [];
      const query = event.query;

      for (let i = 0; i < this.pacienteTratamientoOptions().length; i++) {
          const paciente:PacienteDto = this.pacienteTratamientoOptions()[i];
          if (paciente.nombre!.toLowerCase().indexOf(query.toLowerCase()) == 0) {
              filtered.push(paciente);
          }
      }

      this.filteredPaciente = filtered;
  }

  onSelectPaciente(event: AutoCompleteSelectEvent){
    this.tratamiento.idPaciente = event.value.id;
    console.log(event);
  }
}
