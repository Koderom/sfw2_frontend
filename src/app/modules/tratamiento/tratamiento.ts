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

@Component({
  selector: 'app-tratamiento',
  imports: [DetailTratamiento, CommonModule, ToolbarModule, ButtonModule, InputIconModule, IconFieldModule, TableModule,
    InputTextModule
  ],
  templateUrl: './tratamiento.html',
  styleUrl: './tratamiento.scss'
})
export class Tratamiento {

  tratamientoService = inject(TratamientoSerivce);

  tratamientos = signal<TratamientoDto[]>([]);
  selectedTratamiento = this.getDefaultTratamiento();
  cols = [];

  tratamientoDialogVisible: boolean = false;
  tratamientoSeleccionado!: TratamientoDto;
  submitted = signal(false);


  getDefaultTratamiento(): TratamientoDto{
    return {
      paciente: {}
    }
  }

  newTratamiento(){
    this.tratamientoDialogVisible = true;
    this.tratamientoSeleccionado = this.getDefaultTratamiento();
    this.submitted.set(false);
  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  saveTratamiento(){
    console.log('Guardar Tratamiento:', this.tratamientoSeleccionado);
    this.submitted.set(true);

    this.tratamientoService.crearTratamientoPacinete(this.tratamientoSeleccionado).subscribe({
      next: (response) => {
        console.log('Tratamiento guardado con éxito:', response);
        this.submitted.set(false);
        this.tratamientoSeleccionado = this.getDefaultTratamiento();
        this.tratamientoDialogVisible = false; 
      }, 
      
      error: (error) => {
        console.error('Error al guardar el tratamiento:', error);
      }
    });
  }

  hideDialog(){
    this.submitted.set(false);
    this.tratamientoSeleccionado = this.getDefaultTratamiento();
    this.tratamientoDialogVisible = false;
  }
}