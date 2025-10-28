import { LaboratorioDto } from '@/core/dtos/laboratorio.dto';
import { PacienteDto } from '@/core/dtos/paciente.dto';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ContactoDetail } from '../paciente/contacto-paciente/contacto-detail/contacto-detail';
import { LaboratorioService } from '@/core/services/laboratorio.service';
import { LaboratorioDetail } from './laboratorio-detail/laboratorio-detail';

@Component({
  selector: 'app-laboratorio',
  imports: [TableModule, IconFieldModule, ButtonModule, 
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

  ngOnInit() {
    this.cargarLaboratorios();
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
    this.laboratorioDialogVisible = false;
    this.laboratorioSeleccionado = {};
    this.laboratorioSubmitted.set(false);
    this.cargarLaboratorios();
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
