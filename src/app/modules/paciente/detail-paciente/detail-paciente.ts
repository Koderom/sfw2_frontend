import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { PacienteService } from '@/modules/paciente/paciente.service';
import { PacienteDto } from '@/core/dtos/paciente.dto';
import { DireccionDto } from '@/core/dtos/direccion.dto';
import { AccordionModule } from 'primeng/accordion';
import { FieldsetModule } from 'primeng/fieldset';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ZonaUvDto } from '@/core/dtos/zonaUv.dto';
import { ZonaMzDto } from '@/core/dtos/zonaMz.dto';
import { DireccionSerivce } from '@/core/services/direccion.service';
import { switchMap, tap } from 'rxjs';
import { CentrosaludCaniadaDelCarmen } from '@/core/utils/location/constants';
import {GoogleMap, MapMarker} from '@angular/google-maps';
import {MapGeocoder} from '@angular/google-maps';
import { ContactoPaciente } from '../contacto-paciente/contacto-paciente';
import { Table, TableModule } from 'primeng/table';
import { ContactoDto } from '@/core/dtos/contacto.dto';

@Component({
  selector: 'app-detail-paciente',
  imports: [CommonModule,InputTextModule, FluidModule, ButtonModule, SelectModule, FormsModule, TextareaModule,
    AccordionModule, FieldsetModule, DatePickerModule, InputNumberModule, CheckboxModule,GoogleMap, MapMarker, 
    ContactoPaciente, TableModule],
  templateUrl: './detail-paciente.html',
  styleUrl: './detail-paciente.scss'
})
export class DetailPaciente {
  route = inject(ActivatedRoute);
  router = inject(Router);
  pacienteService = inject(PacienteService);
  contactosPacinetes = signal<ContactoDto[]>([]);

  paciente!: PacienteDto;
  direccion!: DireccionDto;

  dropdownItems = [
        { name: 'Option 1', code: 'Option 1' },
        { name: 'Option 2', code: 'Option 2' },
        { name: 'Option 3', code: 'Option 3' }
    ];
  selectedZonaUvId: string = '';
  selectedZonaMzId: string = '';
  dropdownItem = null;

  generos!: any[];
  zonasUv = signal<ZonaUvDto[]>([]);
  zonasMz = signal<ZonaMzDto[]>([]);
  //MAP
  center: google.maps.LatLngLiteral = CentrosaludCaniadaDelCarmen;
  
  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true, 
    fullscreenControl: false,
    zoomControl: false,
    streetViewControl: false
  };

  zoom = 18;
  marker = signal<google.maps.LatLngLiteral>(CentrosaludCaniadaDelCarmen);

  _direccionService = inject(DireccionSerivce);

  constructor( private geocoder: MapGeocoder){}

  ngOnInit(): void {
    this.loadData();

    this.route.paramMap.subscribe(params => {
      const idPaciente = params.get('id');
      if (idPaciente) {
        this.pacienteService.getPacicienteById(idPaciente).pipe(
          tap(res => console.log("getPacicienteById:", res)),
          switchMap((result) => {
            this.paciente = result.data.paciente!;
            this.paciente.fecha_nacimiento = new Date(this.paciente.fecha_nacimiento!);
            this.contactosPacinetes.set(result.data.contactos || []);
            if(result.data.direccion){
              this.direccion = result.data.direccion!;
              this.selectedZonaMzId = this.direccion.idMza || '';
              this.marker.set({lat: this.direccion.latitud!, lng: this.direccion.longitud!});
              this.center = this.marker();
            } 
            else this.loadDefaultDireccion();

            return this._direccionService.getZonaMzById(this.selectedZonaMzId);
          }),
          switchMap( (resp) => {
            console.log("getZonaMzById:", resp);
            this.selectedZonaMzId = resp.data.id || '';
            this.selectedZonaUvId = resp.data.idZonaUv || '';

            console.log("selectedZonaUvId",this.selectedZonaUvId);
            console.log("selectedZonaMzId",this.selectedZonaMzId);
            return this._direccionService.getZonasMzByUv(this.selectedZonaUvId);
          })
        ).subscribe({
          next: (resp) => {
            console.log("getZonasMzByUv",resp);
            this.zonasMz.set(resp.data);
          },
          error: (err: any) => {
            console.error('Error al obtener getZonaMzById', err);
          }
        })
      }
    });
  }

  loadData(){
    this.loadDefaultgeneros();
    this.loadDefaultPaciente();
    this.loadDefaultDireccion();
    this.loadZonasUv();
  }
  loadDefaultgeneros(){
    this.generos = [
      { label: 'Hombre', value: 1 },
      { label: 'Mujer', value: 2 }
    ];
  }

  loadDefaultPaciente(){
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
  }

  loadDefaultDireccion(){
    this.direccion = {
      descripcion: 'Sin dirección',
      idPaciente: '',
      idMza: '',
      nro_casa: 0,
      latitud: 0,
      longitud: 0,
    }
  }

  loadZonasUv() {
    this._direccionService.getAllZonasUv().subscribe({
      next: (resp) => {
        console.log('getAllZonasUv', resp);
        this.zonasUv.set(resp.data);
      }
    });
  }
  
  loadZonaMz(zonaMzId: string){
    this._direccionService.getZonasMzByUv(zonaMzId).subscribe({
      next: (resp) => {
        console.log('getZonasMzByUv', resp);
        console.log(this.selectedZonaUvId)
        this.zonasMz.set(resp.data);
      },
      error: (err: any) => {
        console.error('Error al obtener zonasMz', err);
      }
    });
  }

  onZonaUvChange(event :  SelectChangeEvent){
    this.loadZonaMz(event.value);
  }

  savePaciente() {
    this.pacienteService.actualizarPaciente(this.paciente).pipe(
      switchMap( res => {
        this.direccion.idPaciente = this.paciente.id!;
        this.direccion.idMza = this.selectedZonaMzId
        return this._direccionService.actualizarDireccionPaciente(this.direccion);
      })
    ).subscribe({
      next: (resp) => {
        console.log('Paciente actualizado', resp);
        this.router.navigate(['/pacientes'], {state: { recargar: true }});
      },
      error: (err) => {
        console.error('Error al actualizar paciente', err);
      }
    })
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
}
