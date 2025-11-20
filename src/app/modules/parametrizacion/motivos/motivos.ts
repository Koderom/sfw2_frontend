import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

import { CitaSerivce } from '@/core/services/cita.service';
import { MotivoDto } from '@/core/dtos/motivo.dto';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-motivos',
  imports: [CommonModule, ButtonModule, TableModule, DialogModule, InputTextModule, FormsModule, ToastModule, PanelModule],
  templateUrl: './motivos.html',
  styleUrl: './motivos.scss'
})
export class Motivos implements OnInit {
  citaService = inject(CitaSerivce);

  motivos = signal<MotivoDto[]>([]);
  loading = signal(false);

  // edición inline
  editIndex = signal<number|null>(null); // índice de la fila en edición
  editMotivo: MotivoDto = { descripcion: '', estado: true };
  // para nueva fila
  newMotivo: MotivoDto = { descripcion: '', estado: true };

  ngOnInit(): void {
    this.loadMotivos();
  }

  loadMotivos(){
    this.loading.set(true);
    this.citaService.getAllMotivo().subscribe({
      next: res => {
        this.motivos.set(res.data || []);
        this.loading.set(false);
      },
      error: err => {
        console.error('Error cargando motivos', err);
        this.loading.set(false);
      }
    });
  }

  startEdit(index: number) {
    const motivo = this.motivos()[index];
    this.editIndex.set(index);
    this.editMotivo = { ...motivo };
  }

  cancelEdit() {
    this.editIndex.set(null);
    this.editMotivo = { descripcion: '', estado: true };
  }

  saveEdit(index: number) {
    const motivo = this.motivos()[index];
    if (!this.editMotivo.descripcion || this.editMotivo.descripcion.trim().length === 0) return;
    if (!motivo.id) return;
    this.citaService.actualizarMotivo(motivo.id, this.editMotivo).subscribe({
      next: res => {
        this.editIndex.set(null);
        this.loadMotivos();
      },
      error: err => console.error('error actualizando motivo', err)
    });
  }

  saveNew() {
    if (!this.newMotivo.descripcion || this.newMotivo.descripcion.trim().length === 0) return;
    this.citaService.crearMotivo(this.newMotivo).subscribe({
      next: res => {
        this.newMotivo = { descripcion: '', estado: true };
        this.loadMotivos();
      },
      error: err => console.error('error creando motivo', err)
    });
  }
}
