import { inject, Injectable } from "@angular/core";
import { environment} from "../../../environments/environment" 
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ResponseDto } from "@/core/dtos/response.dto";
import { PacienteDto } from "@/core/dtos/paciente.dto";
import { ZonaUvDto } from "../dtos/zonaUv.dto";
import { ZonaMzDto } from "../dtos/zonaMz.dto";
import { DireccionDto } from "../dtos/direccion.dto";

@Injectable({providedIn: 'root'})
export class DireccionSerivce{
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);



    getAllZonasUv(): Observable<ResponseDto<ZonaUvDto[]>>{
        const url = `${this.apiUrl}/direccion/zona-uv`;
        return this.http.get<ResponseDto<ZonaUvDto[]>>(url);
    }

    getZonasMzByUv(zonaUvId : string): Observable<ResponseDto<ZonaMzDto[]>>{
        const url = `${this.apiUrl}/direccion/zona-mza/uv/${zonaUvId}`;
        return this.http.get<ResponseDto<ZonaMzDto[]>>(url);
    }

    getZonaMzById(zonaMzId : string): Observable<ResponseDto<ZonaMzDto>>{
        const url = `${this.apiUrl}/direccion/zona-mza/${zonaMzId}`;
        return this.http.get<ResponseDto<ZonaMzDto>>(url);
    }

    crearDireccionPacinete(direccion: DireccionDto): Observable<ResponseDto<DireccionDto[]>>{
        console.log("creando direccion")
        console.log(direccion);

        const url = `${this.apiUrl}/direccion`;
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };
        return this.http.post<ResponseDto<DireccionDto[]>>(url, direccion, httpOptions);
    }

    actualizarDireccionPaciente(direccion: DireccionDto): Observable<ResponseDto<DireccionDto[]>>{
        console.log("creando direccion")
        console.log(direccion);

        const url = `${this.apiUrl}/direccion/${direccion.id}`;
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };
        return this.http.put<ResponseDto<DireccionDto[]>>(url, direccion, httpOptions);
    }
}