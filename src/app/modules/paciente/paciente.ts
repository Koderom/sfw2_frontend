import { PacienteDto } from '@/core/dtos/paciente.dto';
import { Component, inject, signal, ViewChild } from '@angular/core';
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
import { SelectChangeEvent, SelectModule } from 'primeng/select';
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
import { CentrosaludCaniadaDelCarmen } from '@/core/utils/location/constants';
import { ZonaMzDto } from '@/core/dtos/zonaMz.dto';
import { switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-paciente',
  imports: [
    CommonModule,TableModule,FormsModule,ButtonModule,RippleModule,ToastModule,ToolbarModule,
    RatingModule,InputTextModule,TextareaModule,SelectModule,RadioButtonModule,InputNumberModule,
    DialogModule,TagModule,InputIconModule,IconFieldModule,ConfirmDialogModule,DatePickerModule,
    CheckboxModule,GoogleMap, MapMarker],
  templateUrl: './paciente.html',
  styleUrl: './paciente.scss',
  providers: [MessageService]
})
export class Paciente {
  _router = inject(Router);
  _route = inject(ActivatedRoute);
  _pacienteSevice = inject(PacienteService);
  _direccionService = inject(DireccionSerivce);

  paciente!: PacienteDto;
  direccion!: DireccionDto;

  pacientes = signal<PacienteDto[]>([]);
  zonasUv = signal<ZonaUvDto[]>([]);
  zonasMz = signal<ZonaMzDto[]>([]);
  selectedPacientes!: PacienteDto[] | null;

  submitted: boolean = false;
  pacienteDialog: boolean = false;

  generos!: any[];
  cols!: Column[];
  @ViewChild('dt') dt!: Table;

  //MAP
  center: google.maps.LatLngLiteral = CentrosaludCaniadaDelCarmen;
  
  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true, 
    fullscreenControl: false,
    zoomControl: false,
    streetViewControl: false
  };

  zoom = 18;
  marker = signal<google.maps.LatLngLiteral>(CentrosaludCaniadaDelCarmen)

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
    this.loadMyLocation()
    
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

      console.log(this.paciente);
      console.log(this.direccion);

      if(this.paciente.id){
          //TODO: implementar actualizar paciente paciente
          console.log("creando paciente")
      }else{
        this._pacienteSevice.crearPaciente(this.paciente).pipe(
          tap(paciente => console.log(paciente)),
          switchMap((result) => {
            console.log(this.direccion);
            this.direccion.idPaciente = result.data.id;
            return this._direccionService.crearDireccionPacinete(this.direccion);
          })

        ).subscribe({
            next: (result:any) => {
              console.log(result);
              this.closeDialog();
              this.loadData();
            },
            error: (error: any) => {
                console.log(error);
            }
          }
        )
      }


      
  }

  closeDialog(){
    this.submitted = true;
    this.pacienteDialog = false;
    this.paciente = {};
    this.direccion = {};
  }

  editPaciente(paciente: PacienteDto) {
    console.log('paciente-detail');
    console.log(paciente);
    this._router.navigate(['detail-paciente', paciente.id], {relativeTo: this._route});
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
    this.loadDireccionDescripcion(latLng)
  }

  loadDireccionDescripcion(position: google.maps.LatLngLiteral){
    if (this.geocoder) {
      this.geocoder.geocode({ location: position }).subscribe(
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
  
  onZonaUvChange(event :  SelectChangeEvent){
    this.loadZonaMz(event.value);
  }

  loadZonaMz(zonaMzId: string){
    this._direccionService.getZonasMzByUv(zonaMzId).subscribe({
      next: (resp) => {
        this.zonasMz.set(resp.data);
      }
    });
  }

  loadMyLocation(){
    let currentPosition = CentrosaludCaniadaDelCarmen
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition( (position) => {
        currentPosition = {lat: position.coords.latitude, lng: position.coords.longitude}

        this.center = currentPosition;
        this.marker.set(currentPosition);
        this.loadDireccionDescripcion(currentPosition);
      });
    }else{
      this.center = currentPosition;
      this.marker.set(currentPosition);
      this.loadDireccionDescripcion(currentPosition);
    }

    this.direccion.latitud = currentPosition.lat;
    this.direccion.longitud = currentPosition.lng;
  }
}
