import { LaboratorioDto } from '@/core/dtos/laboratorio.dto';
import { PacienteDto } from '@/core/dtos/paciente.dto';
import { Component, inject, Input, OnInit, signal, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ContactoDetail } from '../paciente/contacto-paciente/contacto-detail/contacto-detail';
import { LaboratorioService } from '@/core/services/laboratorio.service';
import { LaboratorioDetail } from './laboratorio-detail/laboratorio-detail';
import { CommonModule } from '@angular/common';
import { ExportExcel } from '@/core/utils/reports/ExportExcel';

@Component({
  selector: 'app-laboratorio',
  imports: [CommonModule, TableModule, IconFieldModule, ButtonModule, 
    ToolbarModule, InputTextModule, InputNumberModule, InputIconModule, LaboratorioDetail],
  templateUrl: './laboratorio.html',
  styleUrl: './laboratorio.scss'
})
export class Laboratorio implements OnInit {
  @Input() idPaciente?: string;

  laboratorioService = inject(LaboratorioService);

  laboratorios = signal<LaboratorioDto[]>([]);
  laboratorioDialogVisible: boolean = false;
  laboratorioSeleccionado: LaboratorioDto = {}; 
  laboratorioSubmitted = signal(false);

  @ViewChild('dt') dt!: Table;

  ngOnInit() {
    this.cargarLaboratorios();
  }

  exportCSV() {
    console.log("Exportando item: ", this.dt.value);
    let data = this.dt.value.map( (item: LaboratorioDto) => {
      console.log("Item a exportar: ", item);
    const {id,paciente, tipoLaboratorio, tipoResultado, tipoControl, ...campos} = item
      return {
        paciente: paciente?.nombre,
        tipo_laboratorio: tipoLaboratorio?.descripcion,
        tipo_resultado: tipoResultado?.descripcion,
        tipo_control: tipoControl?.descripcion,
        ...campos,
      }
    });
    ExportExcel.export(data, 'Laboratorios');
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  cargarLaboratorios() {
    if (this.idPaciente) {
      this.laboratorioService.getAllLaboratoriosByPaciente(this.idPaciente).subscribe({
        next: (response) => {
          this.laboratorios.set(response.data || []);
        }
      });
    } else {
      this.laboratorioService.getAllLaboratorios().subscribe({
        next: (response) => {
          this.laboratorios.set(response.data || []);
        }
      });
    }
  }

  onSaveLaboratorio(){
    console.log("Guardando laboratorio: ", this.laboratorioSeleccionado);
    this.laboratorioService.crearLaboratorioPaciente(this.laboratorioSeleccionado).subscribe({
      next: (response) => {
        console.log("Laboratorio creado: ", response);
        this.cargarLaboratorios();    
      } 
    });
    this.laboratorioDialogVisible = false;
    this.laboratorioSeleccionado = {};
    this.laboratorioSubmitted.set(false);
  }

  onCancelDialogLaboratorio(){
    this.laboratorioDialogVisible = false;
  }

  newLaboratorio(){
    this.laboratorioSeleccionado = {};
    if (this.idPaciente) {
      this.laboratorioSeleccionado.idPaciente = this.idPaciente;
    }
    this.laboratorioDialogVisible = true;
  }
}
