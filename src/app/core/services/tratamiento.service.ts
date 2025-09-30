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

@Injectable({providedIn: 'root'})
export class TratamientoSerivce{
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    getTratamientoById(tratamientoId: string): Observable<ResponseDto<TratamientoDto>>{        
        const url = `${this.apiUrl}/tratamiento/${tratamientoId}`;
        return this.http.get<ResponseDto<TratamientoDto>>(url);
    }

    getAllTratamientos(): Observable<ResponseDto<TratamientoDto[]>>{
        const url = `${this.apiUrl}/tratamiento`;
        return this.http.get<ResponseDto<TratamientoDto[]>>(url);
    }

    getAllTipoTratamiento(): Observable<ResponseDto<TipoTratamientoDto[]>>{
        const url = `${this.apiUrl}/tratamiento/tipo-tratamiento`;
        return this.http.get<ResponseDto<TipoTratamientoDto[]>>(url);
    } 
    
    getAllEstadoTratamiento(): Observable<ResponseDto<EstadoTratamientoDto[]>>{
        const url = `${this.apiUrl}/tratamiento/estado-tratamiento`;
        return this.http.get<ResponseDto<EstadoTratamientoDto[]>>(url);
    }

    crearTratamientoPacinete(direccion: TratamientoDto): Observable<ResponseDto<TratamientoDto[]>>{
        console.log("creando tratamiento")
        console.log(direccion);

        const url = `${this.apiUrl}/tratamiento`;
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };
        return this.http.post<ResponseDto<TratamientoDto[]>>(url, direccion, httpOptions);
    }
}