import { PacienteDto } from '@/core/dtos/paciente.dto';
import { Component, Inject, inject, signal, ViewChild } from '@angular/core';
import { Button } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { PacienteService } from './paciente.service';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { Column } from '@/core/utils/ui/column';
import {GoogleMap, MapMarker} from '@angular/google-maps';
import {MapGeocoder} from '@angular/google-maps';
import { DireccionDto } from '@/core/dtos/direccion.dto';
import { ZonaUvDto } from '@/core/dtos/zonaUv.dto';
import { DireccionSerivce } from '@/core/services/direccion.service';


@Component({
  selector: 'app-paciente',
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    DatePickerModule,
    CheckboxModule,
    GoogleMap, MapMarker
  ],
  templateUrl: './paciente.html',
  styleUrl: './paciente.scss',
  providers: [MessageService]
})
export class Paciente {
  _pacienteSevice = inject(PacienteService);
  _direccionService = inject(DireccionSerivce);

  paciente!: PacienteDto;
  direccion!: DireccionDto;

  pacientes = signal<PacienteDto[]>([]);
  zonasUv = signal<ZonaUvDto[]>([]);
  selectedPacientes!: PacienteDto[] | null;

  submitted: boolean = false;
  pacienteDialog: boolean = false;

  generos!: any[];
  cols!: Column[];
  @ViewChild('dt') dt!: Table;

  //MAP
  center: google.maps.LatLngLiteral = {lat: -17.8101551, lng: -63.1534107};
  
  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true, 
    fullscreenControl: false,
    zoomControl: false,
    streetViewControl: false
  };

  zoom = 18;
  marker = signal<google.maps.LatLngLiteral>({lat: -17.8101551, lng: -63.1534107})

  constructor(private service: MessageService, private geocoder: MapGeocoder) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    
    this.generos = [
      { label: 'Hombre', value: 1 },
        { label: 'Mujer', value: 2 }
      ];
      
      this.cols = [
        { field: 'nombre', header: 'Nombre', customExportHeader: 'Product Code' },
        { field: 'telefono', header: 'Telefono' }
      ];
      
      this._pacienteSevice.getAllPacientes().subscribe({
          next: (resp) =>{
            this.pacientes.set(resp.data);
          }
      });
  }

  openNew() {
    this.paciente = {
      nombre: '',
      numero_doc: '',
      tipo_doc: 1,
      fecha_nacimiento: undefined,
      genero: 1,
      email: '',
      tiene_whatsapp: false,
      telefono: undefined,
      estado: true,
    };
    this.resetDireccion();
    this.loadZonasUv()
    
    this.submitted = false;
    this.pacienteDialog = true;
  }

  hideDialog() {
      this.pacienteDialog = false;
      this.submitted = false;
  }

  savePaciente() {
      this.submitted = true;
      let _pacientes = this.pacientes();

      if(this.paciente.id){
          //TODO: implementar actualizar paciente paciente
          console.log("creando paciente")
      }else{
        this._pacienteSevice.crearPaciente(this.paciente).subscribe(
          response => {
            console.log(response);
            this.service.add({ severity: 'success', summary: 'Registrado', detail: `Paciente: ${response.data.nombre}, ${response.message}`});
          },
          error => {
            console.log(error);
            this.service.add({ severity: 'error', summary: "Error" , detail: 'Error al registrar al paciente' });
          }
        );
      }


      this.submitted = true;
      this.pacienteDialog = false;
      this.paciente = {};
  }

  editProduct(paciente: PacienteDto) {
      this.paciente = { ...paciente };
      this.pacienteDialog = true;
  }

  deleteProduct(paciente: PacienteDto){

  }

  onGlobalFilter(table: Table, event: Event) {
      table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  
  addMarker(event: google.maps.MapMouseEvent) {
    const latLng = event.latLng!.toJSON();
    this.marker.set(latLng);

    this.direccion.latitud = latLng.lat;
    this.direccion.longitud = latLng.lng;

    if (this.geocoder) {
      this.geocoder.geocode({ location: latLng }).subscribe(
        ({results}) => this.direccion.descripcion = results[1].formatted_address
      );
    }
  }

  resetDireccion(){
    this.direccion = {
      descripcion: ''
    }
  }

  loadZonasUv(){
    this._direccionService.getAllZonasUv().subscribe({
      next: (resp) =>{
        this.zonasUv.set(resp.data);
      }
    });
  }
}
