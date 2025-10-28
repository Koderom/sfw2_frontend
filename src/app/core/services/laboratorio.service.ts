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
import { TipoControlDto } from "../dtos/tipocontrol.dto";
import { TipoLaboratorioDto } from "../dtos/tipolaboratorio.dto";
import { TipoResultadoDto } from "../dtos/tiporesultado.dto";
import { LaboratorioDto } from "../dtos/laboratorio.dto";

@Injectable({providedIn: 'root'})
export class LaboratorioService{
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    getAllTipoControl(): Observable<ResponseDto<TipoControlDto[]>>{
        const url = `${this.apiUrl}/laboratorio/tipos-control`;
        return this.http.get<ResponseDto<TipoControlDto[]>>(url);
    } 
    
    getAllTipoLaboratorio(): Observable<ResponseDto<TipoLaboratorioDto[]>>{
        const url = `${this.apiUrl}/laboratorio/tipos-laboratorio`;
        return this.http.get<ResponseDto<TipoLaboratorioDto[]>>(url);
    }

    getAllTipoResultadoByTipoLaboratorio(tipoLaboratorioId: string): Observable<ResponseDto<TipoResultadoDto[]>>{
        const url = `${this.apiUrl}/laboratorio/tipos-resultado/${tipoLaboratorioId}`;
        return this.http.get<ResponseDto<TipoResultadoDto[]>>(url);
    }

    crearLaboratorioPaciente(laboratorio: LaboratorioDto): Observable<ResponseDto<LaboratorioDto>>{
        console.log("creando laboratorio...", laboratorio);

        const url = `${this.apiUrl}/laboratorio`;
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };
        return this.http.post<ResponseDto<LaboratorioDto>>(url, laboratorio, httpOptions);
    }

    getAllLaboratoriosByPaciente(pacienteId: string): Observable<ResponseDto<LaboratorioDto[]>>{
        const url = `${this.apiUrl}/laboratorio/paciente/${pacienteId}`;
        return this.http.get<ResponseDto<LaboratorioDto[]>>(url);
    }

    getAllLaboratorios(): Observable<ResponseDto<LaboratorioDto[]>>{
        const url = `${this.apiUrl}/laboratorio`;
        return this.http.get<ResponseDto<LaboratorioDto[]>>(url);
    }
}