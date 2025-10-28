import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

import { SintomaDto } from '@/core/dtos/sintoma.dto';
import { PacienteService } from '@/modules/paciente/paciente.service';

@Component({
  selector: 'app-sintomas',
  imports: [CommonModule, ButtonModule, TableModule, InputTextModule, FormsModule, ToastModule],
  templateUrl: './sintomas.html',
  styleUrl: './sintomas.scss'
})
export class Sintomas implements OnInit {
  pacienteService = inject(PacienteService);

  sintomas = signal<SintomaDto[]>([]);
  loading = signal(false);

  editIndex = signal<number|null>(null);
  editSintoma: SintomaDto = { descripcion: '', estado: true };
  newSintoma: SintomaDto = { descripcion: '', estado: true };

  ngOnInit(): void {
    this.loadSintomas();
  }

  loadSintomas(){
    this.loading.set(true);
    this.pacienteService.getAllSintomas().subscribe({
      next: res => {
        this.sintomas.set(res.data || []);
        this.loading.set(false);
      },
      error: err => {
        console.error('Error cargando sintomas', err);
        this.loading.set(false);
      }
    });
  }

  startEdit(index: number) {
    const sintoma = this.sintomas()[index];
    this.editIndex.set(index);
    this.editSintoma = { ...sintoma };
  }

  cancelEdit() {
    this.editIndex.set(null);
    this.editSintoma = { descripcion: '', estado: true };
  }

  saveEdit(index: number) {
    const sintoma = this.sintomas()[index];
    if (!this.editSintoma.descripcion || this.editSintoma.descripcion.trim().length === 0) return;
    if (!sintoma.id) return;
    this.pacienteService.actualizarSintoma(sintoma.id, this.editSintoma).subscribe({
      next: res => {
        this.editIndex.set(null);
        this.loadSintomas();
      },
      error: err => console.error('error actualizando sintoma', err)
    });
  }

  saveNew() {
    if (!this.newSintoma.descripcion || this.newSintoma.descripcion.trim().length === 0) return;
    this.pacienteService.crearSintoma(this.newSintoma).subscribe({
      next: res => {
        this.newSintoma = { descripcion: '', estado: true };
        this.loadSintomas();
      },
      error: err => console.error('error creando sintoma', err)
    });
  }
}
