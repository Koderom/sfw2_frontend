import { ContactoDto } from '@/core/dtos/contacto.dto';
import { Component, EventEmitter, inject, Input, Output, signal, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputIconModule } from 'primeng/inputicon';
import { CheckboxModule } from 'primeng/checkbox';
import { ParentescoDto } from '@/core/dtos/parentesco.dto';
import { PacienteService } from '../../paciente.service';
import { SelectChangeEvent, SelectModule } from 'primeng/select';

@Component({
  selector: 'app-contacto-detail',
  imports: [Button, FormsModule, DialogModule, CommonModule, InputTextModule, InputNumberModule, InputIconModule,
    CheckboxModule, SelectModule
  ],
  templateUrl: './contacto-detail.html',
  styleUrl: './contacto-detail.scss'
})
export class ContactoDetail {
    @Input() visible = false;          
    @Input() contacto!: ContactoDto;
    @Input() submitted = false;

    @Output() save = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    tipoParentescoOptions = signal<ParentescoDto[]>([]);
    selectedParentescoId = '';

    pacienteService = inject(PacienteService);

  ngOnInit() {
    this.pacienteService.getAllTipoParentesco().subscribe({
      next: (response) => {
        console.log('Tipo Parentesco:', response);
        console.log('contacto', this.contacto);
        if (response.data) {
          this.tipoParentescoOptions.set(response.data);
          this.selectedParentescoId = this.contacto.id_tipo_parentesco || '';
        }
      },
      error: (error) => {
        console.error('Error fetching tipo parentesco:', error);
      }
    });
  }

  onDialogShow() {
    if (this.contacto) {
      this.selectedParentescoId = this.contacto.id_tipo_parentesco || '';
    }
  }

  onSave() {
    this.contacto.id_tipo_parentesco = this.selectedParentescoId;
    this.save.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
