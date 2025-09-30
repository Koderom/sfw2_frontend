import { TratamientoDto } from '@/core/dtos/tratamiento.dto';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { DetailTratamiento } from './detail-tratamiento/detail-tratamiento';
import { TratamientoSerivce } from '@/core/services/tratamiento.service';
import { CheckboxModule } from 'primeng/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailCita } from './citas-tratamiento/datail-cita/detail-cita';
import { CitaDto } from '@/core/dtos/cita.dto';
import { ConfirmationService } from 'primeng/api';
import { CitaSerivce } from '@/core/services/cita.service';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-tratamiento',
  imports: [DetailTratamiento, CommonModule, ToolbarModule, ButtonModule, InputIconModule, IconFieldModule, TableModule,
    InputTextModule, CheckboxModule, DetailCita
  ],
  templateUrl: './tratamiento.html',
  styleUrl: './tratamiento.scss'
})
export class Tratamiento {
  tratamientoService = inject(TratamientoSerivce);
  citaService = inject(CitaSerivce);

  _router = inject(Router);
  _route = inject(ActivatedRoute);

  tratamientos = signal<TratamientoDto[]>([]);
  selectedTratamientos!: TratamientoDto[] | null;
  cols = [];

  tratamientoDialogVisible: boolean = false;
  tratamientoSeleccionado: TratamientoDto = this.getDefaultTratamiento();;
  tratamientoSubmitted = signal(false);

  citaDialogVisible: boolean = false;
  citaSelected!: CitaDto;
  citaSubmitted = signal(false);

  ngOnInit(){
    this.loadTratamientos();
  }

  loadTratamientos(){
    this.tratamientoService.getAllTratamientos().subscribe({
      next: (response) => {
        this.tratamientos.set(response.data || []);
      }
    });
  }

  getDefaultTratamiento(): TratamientoDto{
    return {
      paciente: {}
    }
  }

  newTratamiento(){
    this.tratamientoDialogVisible = true;
    this.tratamientoSeleccionado = this.getDefaultTratamiento();
    this.tratamientoSubmitted.set(false);
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  saveTratamiento(){
    console.log('Guardando Tratamiento:', this.tratamientoSeleccionado);
    this.tratamientoSubmitted.set(true);

    this.tratamientoService.crearTratamientoPacinete(this.tratamientoSeleccionado).subscribe({
      next: (response) => {
        console.log('Tratamiento guardado con éxito:', response);
        this.tratamientoSubmitted.set(false);
        this.tratamientoSeleccionado = this.getDefaultTratamiento();
        this.tratamientoDialogVisible = false; 
      }, 
      
      error: (error) => {
        console.error('Error al guardar el tratamiento:', error);
      }
    });
  }

  hideDialog(){
    this.tratamientoSubmitted.set(false);
    this.tratamientoSeleccionado = this.getDefaultTratamiento();
    this.tratamientoDialogVisible = false;
  }

  navigateCitaTratamiento(tratamiento: TratamientoDto) {
    console.log('tratamiento-detail', tratamiento);
    this._router.navigate(['citas-tratamiento', tratamiento.id], {relativeTo: this._route});
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

  showDialogCita(tratamiento: TratamientoDto){
    this.tratamientoSeleccionado = tratamiento;
    this.citaSelected = this.getDefaultCita(tratamiento.id!);
    this.citaDialogVisible = true;
    this.citaSubmitted.set(false);

  }
  hideDialogCita(){
    this.citaSubmitted.set(false);
    this.citaDialogVisible = false;
    this.citaSelected = this.getDefaultCita('');
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
}