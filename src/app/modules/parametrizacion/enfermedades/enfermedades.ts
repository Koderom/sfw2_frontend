import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

import { EnfermedadDto } from '@/core/dtos/enfermedad.dto';
import { PacienteService } from '@/modules/paciente/paciente.service';

@Component({
  selector: 'app-enfermedades',
  imports: [CommonModule, ButtonModule, TableModule, InputTextModule, FormsModule, ToastModule],
  templateUrl: './enfermedades.html',
  styleUrl: './enfermedades.scss'
})
export class Enfermedades implements OnInit {
  pacienteService = inject(PacienteService);

  enfermedades = signal<EnfermedadDto[]>([]);
  loading = signal(false);

  editIndex = signal<number|null>(null);
  editEnfermedad: EnfermedadDto = { descripcion: '', estado: true };
  newEnfermedad: EnfermedadDto = { descripcion: '', estado: true };

  ngOnInit(): void {
    this.loadEnfermedades();
  }

  loadEnfermedades(){
    this.loading.set(true);
    this.pacienteService.getAllEnfermedades().subscribe({
      next: res => {
        this.enfermedades.set(res.data || []);
        this.loading.set(false);
      },
      error: err => {
        console.error('Error cargando enfermedades', err);
        this.loading.set(false);
      }
    });
  }

  startEdit(index: number) {
    const enfermedad = this.enfermedades()[index];
    this.editIndex.set(index);
    this.editEnfermedad = { ...enfermedad };
  }

  cancelEdit() {
    this.editIndex.set(null);
    this.editEnfermedad = { descripcion: '', estado: true };
  }

  saveEdit(index: number) {
    const enfermedad = this.enfermedades()[index];
    if (!this.editEnfermedad.descripcion || this.editEnfermedad.descripcion.trim().length === 0) return;
    if (!enfermedad.id) return;
    this.pacienteService.actualizarEnfermedad(enfermedad.id, this.editEnfermedad).subscribe({
      next: res => {
        this.editIndex.set(null);
        this.loadEnfermedades();
      },
      error: err => console.error('error actualizando enfermedad', err)
    });
  }

  saveNew() {
    if (!this.newEnfermedad.descripcion || this.newEnfermedad.descripcion.trim().length === 0) return;
    this.pacienteService.crearEnfermedad(this.newEnfermedad).subscribe({
      next: res => {
        this.newEnfermedad = { descripcion: '', estado: true };
        this.loadEnfermedades();
      },
      error: err => console.error('error creando enfermedad', err)
    });
  }
}
