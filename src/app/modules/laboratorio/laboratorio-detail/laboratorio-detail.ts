import { TipoResultadoDto } from '@/core/dtos/tiporesultado.dto';  
import { TipoLaboratorioDto } from '@/core/dtos/tipolaboratorio.dto';
import { TipoControlDto } from '@/core/dtos/tipocontrol.dto';  
import { EstadoTratamientoDto } from '@/core/dtos/estadotratamiento.dto';
import { LaboratorioDto } from '@/core/dtos/laboratorio.dto';
import { PacienteDto } from '@/core/dtos/paciente.dto';
import { TipoTratamientoDto } from '@/core/dtos/tipotratamiento.dto';
import { TratamientoDto } from '@/core/dtos/tratamiento.dto';
import { LaboratorioService } from '@/core/services/laboratorio.service';
import { TratamientoSerivce } from '@/core/services/tratamiento.service';
import { PacienteService } from '@/modules/paciente/paciente.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { Button } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-laboratorio-detail',
  imports: [Button, FormsModule, DialogModule, CommonModule, InputTextModule, InputNumberModule, InputIconModule,
    CheckboxModule, SelectModule,DatePickerModule, IftaLabelModule, TextareaModule, AutoComplete, RadioButtonModule
  ],
  templateUrl: './laboratorio-detail.html',
  styleUrl: './laboratorio-detail.scss'
})
export class LaboratorioDetail {
  @Input() visible = false;          
  @Input() laboratorio!: LaboratorioDto;
  @Input() submitted = false;

  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  laboratorioService = inject(LaboratorioService);
  pacienteService = inject(PacienteService);

  pacienteOptions = signal<PacienteDto[]>([]);
  filteredPaciente: PacienteDto[] = [];
  selectedPacienteId : any;

  tipoLaboratorioOptions = signal<TipoLaboratorioDto[]>([]);
  selectedTipoLaboratorioId: string | undefined;

  tipoControlOptions = signal<TipoControlDto[]>([]);
  selectedTipoControlId: string | undefined;

  tipoResultadoOptions = signal<TipoResultadoDto[]>([]);
  selectedTipoResultadoId: string | undefined;

  ngOnInit(){
    this.loadPacientesLaboratorioOptions();
    this.loadTipoLaboratorioOptions();
    this.loadTipoControlOptions();
  }

  loadTipoLaboratorioOptions(){
    this.laboratorioService.getAllTipoLaboratorio().subscribe({
      next: (response) => {
        this.tipoLaboratorioOptions.set(response.data || []);
        let idToSelect = this.laboratorio?.idTipoLaboratorio;
        if (!idToSelect && response.data && response.data.length > 0) {
          idToSelect = response.data[0].id;
        }
        if (idToSelect) {
          this.selectedTipoLaboratorioId = idToSelect;
          this.laboratorio.idTipoLaboratorio = idToSelect;
          this.loadTipoResultadoOptions(idToSelect);
        }
      }
    });
  }

  onTipoLaboratorioChange(id: string) {
    if (!id) return;
    this.laboratorio.idTipoLaboratorio = id;
    this.loadTipoResultadoOptions(id);
  }

  loadTipoResultadoOptions(tipoLaboratorioId: string) {
    this.laboratorioService.getAllTipoResultadoByTipoLaboratorio(tipoLaboratorioId).subscribe({
      next: (response) => {
        this.tipoResultadoOptions.set(response.data || []);
        // Seleccionar por defecto la primera opción
        if (response.data && response.data.length > 0) {
          this.selectedTipoResultadoId = response.data[0].id;
          this.laboratorio.idTipoResultado = response.data[0].id;
        }
      }
    });
  }

  loadTipoControlOptions(){
    this.laboratorioService.getAllTipoControl().subscribe({
      next: (response) => {
        this.tipoControlOptions.set(response.data || []);
        if (this.laboratorio && this.laboratorio.idTipoControl) {
          this.selectedTipoControlId = this.laboratorio.idTipoControl;
        }
      }
    });
  }

  loadPacientesLaboratorioOptions(){
    this.pacienteService.getAllPacientes().subscribe({
      next: (response) => {
        this.pacienteOptions.set(response.data || []);
      }
    });
  }

  onDialogShow(){
    if(this.laboratorio.idPaciente){
      this.selectedPacienteId = this.pacienteOptions().find(p => p.id === this.laboratorio.idPaciente) as PacienteDto; 
    }
  }

  onCancel(){
    this.cancel.emit();
  }
  onSave(){
    this.filteredPaciente = [];
    this.laboratorio.idTipoResultado = this.selectedTipoResultadoId;
    this.laboratorio.idTipoControl = this.selectedTipoControlId;
    this.laboratorio.idPaciente = this.selectedPacienteId.id;
    this.laboratorio.idTipoLaboratorio = this.selectedTipoLaboratorioId;
    
    this.save.emit();
  }


  filterPaciente(event: AutoCompleteCompleteEvent) {
      const filtered: any[] = [];
      const query = event.query;

      for (let i = 0; i < this.pacienteOptions().length; i++) {
          const paciente:PacienteDto = this.pacienteOptions()[i];
          if (paciente.nombre!.toLowerCase().indexOf(query.toLowerCase()) == 0) {
              filtered.push(paciente);
          }
      }

      this.filteredPaciente = filtered;
  }

  onSelectPaciente(event: AutoCompleteSelectEvent){
    // this.tratamiento.idPaciente = event.value.id;
    console.log(event);
  }
}
