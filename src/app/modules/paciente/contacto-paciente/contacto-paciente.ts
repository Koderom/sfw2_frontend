import { ContactoDto } from '@/core/dtos/contacto.dto';
import { Column } from '@/core/utils/ui/column';
import { Component, inject, Input, input, signal } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { ContactoDetail } from './contacto-detail/contacto-detail';
import { ToolbarModule } from 'primeng/toolbar';
import { PacienteDto } from '@/core/dtos/paciente.dto';
import { Paciente } from '@/modules/paciente';
import { PacienteService } from '../paciente.service';
import { ParentescoDto } from '@/core/dtos/parentesco.dto';


@Component({
  selector: 'app-contacto-paciente',
  imports: [TableModule, IconFieldModule, ButtonModule, ContactoDetail, 
    ToolbarModule, InputTextModule, InputNumberModule, InputIconModule],
  templateUrl: './contacto-paciente.html',
  styleUrl: './contacto-paciente.scss'
})
export class ContactoPaciente {
  @Input() contactos: ContactoDto[] = [];
  @Input() paciente: PacienteDto | undefined;
  
  cols!: Column[];
  selectedContactos!: ContactoDto[] | null;

  contactoDialogVisible: boolean = false;
  contactoSeleccionado!: ContactoDto;
  submitted = signal(false);

  _pacienteservice = inject(PacienteService);
  tipoParentesco = signal<Map<string, string>>(new Map());
  pacienteService = inject(PacienteService);

  ngOnInit(){
    this.loadData();
  }

  loadData() {
    this.cols = [
        { field: 'nombre', header: 'Nombre', customExportHeader: 'Product Code' },
    ];
    this.contactoSeleccionado = this.getDefaultContacto();
    this.loadTipoParentesco();
  }

  loadTipoParentesco() {
    this.pacienteService.getAllTipoParentesco().subscribe({
      next: (response) => {
        console.log('Tipo Parentesco:', response);
        if (response.data) {
          const map = new Map<string, string>();
          response.data.forEach(tp => {
            map.set(tp.id || '', tp.descripcion || '');
          });
          this.tipoParentesco.set(map);
        }
      },
      error: (error) => {
        console.error('Error fetching tipo parentesco:', error);
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
      // table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  saveContacto() {
    this.submitted.set(true);
    
    this.contactoSeleccionado.id_paciente = this.paciente?.id || '';
    this.contactoSeleccionado.numero_telefono_contacto = this.contactoSeleccionado.numero_telefono_contacto?.toString() || '';
    console.log('saveContacto contacto...:', this.contactoSeleccionado);

    if(this.contactoSeleccionado.id) this.actualizarContacto();
    else this.crearContacto();
    
  }

  crearContacto() {
    this._pacienteservice.crearContactoPaciente(this.contactoSeleccionado).subscribe({
      next: (response) => {
        console.log('Contacto guardado con éxito:', response);
        this.contactoDialogVisible = false;
        this.loadContactosPaciente();
      },
      error: (error) => {
        console.error('Error al guardar el contacto:', error);
      }
    });
  }

  actualizarContacto() {
    this._pacienteservice.actualizarContactoPaciente(this.contactoSeleccionado).subscribe({
      next: (response) => {
        console.log('Contacto actualizado con éxito:', response);
        this.contactoDialogVisible = false;
        this.loadContactosPaciente();
      },
      error: (error) => {
        console.error('Error al actualizar el contacto:', error);
      }
    });
  }

  hideDialog() {
    this.contactoDialogVisible = false;
    this.contactoSeleccionado = this.getDefaultContacto();
    this.submitted.set(false);
  }
  
  newContacto() {
    this.contactoDialogVisible = true;
    this.contactoSeleccionado = this.getDefaultContacto();
    this.submitted.set(false);
  }


  getDefaultContacto(): ContactoDto {
    return {
      id_paciente: '',
      nombre_contacto: '',
      id_tipo_parentesco: '',
      numero_telefono_contacto: '',
      direccion: ''
    };
  }

  loadContactosPaciente(){
    this.pacienteService.getContactosByPacienteId(this.paciente?.id || '').subscribe({
      next: (response) => {
        console.log('Contactos del paciente:', response);
        if (response.data) {
          this.contactos = response.data;
        }
      },
      error: (error) => {
        console.error('Error fetching contactos del paciente:', error);
      }
    });
  }

  editContacto(contacto: ContactoDto) {
    this.contactoSeleccionado = { ...contacto };
    this.contactoSeleccionado.id_tipo_parentesco = contacto.tipo_parentesco?.id || '';
    console.log('Editando contacto:', this.contactoSeleccionado);
    this.contactoDialogVisible = true;
    this.submitted.set(false);
  }
}
