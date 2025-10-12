import { inject, Injectable } from "@angular/core";
import { environment} from "../../../environments/environment" 
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ResponseDto } from "@/core/dtos/response.dto";
import { PacienteDto } from "@/core/dtos/paciente.dto";
import { ZonaUvDto } from "../dtos/zonaUv.dto";
import { ZonaMzDto } from "../dtos/zonaMz.dto";
import { DireccionDto } from "../dtos/direccion.dto";
import { TipoTratamientoDto } from "../dtos/tipotratamiento.dto";
import { EstadoTratamientoDto } from "../dtos/estadotratamiento.dto";
import { TratamientoDto } from "../dtos/tratamiento.dto";
import { CitaDto } from "../dtos/cita.dto";
import { TipoCitaDto } from "../dtos/tipocita.dto";
import { EstadoCitaDto } from "../dtos/estadocita.dto";
import { MotivoDto } from "../dtos/motivo.dto";

@Injectable({providedIn: 'root'})
export class CitaSerivce{
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    getAllCitas(tratamientoId: string): Observable<ResponseDto<CitaDto[]>>{
        const url = `${this.apiUrl}/cita/tratamiento/${tratamientoId}`;
        return this.http.get<ResponseDto<CitaDto[]>>(url);
    }

    getAllTipoCita(): Observable<ResponseDto<TipoCitaDto[]>>{
        const url = `${this.apiUrl}/cita/tipo-cita`;
        return this.http.get<ResponseDto<TipoCitaDto[]>>(url);
    } 
    
    getAllEstadoCita(): Observable<ResponseDto<EstadoCitaDto[]>>{
        const url = `${this.apiUrl}/cita/estado-cita`;
        return this.http.get<ResponseDto<EstadoCitaDto[]>>(url);
    }

    getAllMotivo(): Observable<ResponseDto<MotivoDto[]>>{
        const url = `${this.apiUrl}/cita/motivo`;
        return this.http.get<ResponseDto<MotivoDto[]>>(url);
    }

    crearCitaTratamiento(cita: CitaDto): Observable<ResponseDto<CitaDto>>{
        console.log("creando cita...", cita);

        const url = `${this.apiUrl}/cita`;
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };
        return this.http.post<ResponseDto<CitaDto>>(url, cita, httpOptions);
    }
}