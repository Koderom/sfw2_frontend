import { PacienteDto } from '@/core/dtos/paciente.dto';
import { CentrosaludCaniadaDelCarmen } from '@/core/utils/location/constants';
import { PacienteService } from '@/modules/paciente/paciente.service';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { GoogleMap, MapAdvancedMarker, MapMarkerClusterer } from '@angular/google-maps';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-mapa-calor',
  imports: [CommonModule, GoogleMap, PanelModule, MapMarkerClusterer, MapAdvancedMarker],
  templateUrl: './mapa-calor.html',
  styleUrl: './mapa-calor.scss'
})
export class MapaCalor {
  center: google.maps.LatLngLiteral = CentrosaludCaniadaDelCarmen;
  mapOptions: google.maps.MapOptions = {
    mapId: "my-map-id",
    disableDefaultUI: true, 
    fullscreenControl: true,
    zoomControl: true,
    streetViewControl: false
  };
  zoom = 18;

  markers: google.maps.LatLngLiteral[] = [];
  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };

  pacienteService = inject(PacienteService);

  markerPositions: google.maps.LatLngLiteral[] = [];

  addMarker(event: google.maps.MapMouseEvent) {
    // this.markerPositions.push(event.latLng!.toJSON());
  }

  ngOnInit(){
    this.pacienteService.getAllPacientes().subscribe({
      next: (response) => {
        let pacientes: PacienteDto[] = response.data;
        let pacienteLocation: google.maps.LatLngLiteral[] = [];
        if(pacientes && pacientes.length > 0){
          pacientes.forEach( (paciente) => {
              pacienteLocation.push({
                lat: paciente.direccion!.latitud!,
                lng: paciente.direccion!.longitud!
              });
          });
        }

        this.markerPositions = pacienteLocation;
      }
    });
  }
  
}
