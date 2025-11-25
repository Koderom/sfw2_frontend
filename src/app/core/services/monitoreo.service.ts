import { inject, Injectable } from "@angular/core";
import { environment} from "../../../environments/environment" 
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ResponseDto } from "@/core/dtos/response.dto";
import { PacienteDto } from "@/core/dtos/paciente.dto";
import { PacienteDetailDto } from "@/core/dtos/pacientedetail.dto";
import { ParentescoDto } from "@/core/dtos/parentesco.dto";
import { ContactoDto } from "@/core/dtos/contacto.dto";
import { CitaDto } from "../dtos/cita.dto";
import { IncidenciaTbDto } from "../dtos/incidencias-tb.dto";
import { MotivoNoVisitaDto } from "../dtos/motivo-no-visita.dto";
import { RiesgoAbandonoDto } from "../dtos/riesgo-abandono.dto";


@Injectable({providedIn: 'root'})
export class MonitoreoService{
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    getPacientesRecientes(fechaInicio:Date, fechaFin:Date): Observable<ResponseDto<PacienteDto[]>> {
        const url = `${this.apiUrl}/monitoreo/pacientes-nuevos`;
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };
        return this.http.post<ResponseDto<PacienteDto[]>>(url, {fechaInicio, fechaFin}, httpOptions);
    }

    getPacientesPendientes(): Observable<ResponseDto<CitaDto[]>> {
        const url = `${this.apiUrl}/monitoreo/pacientes-citas`;
        return this.http.get<ResponseDto<CitaDto[]>>(url);
    }

    getIndicadoresEvaluacion(): Observable<ResponseDto<IncidenciaTbDto[]>> {
        const url = `${this.apiUrl}/monitoreo/indicadores-evaluacion`;
        return this.http.get<ResponseDto<IncidenciaTbDto[]>>(url);
    }
    getMotivoDeNoVisitaReporte(fecha_incio:Date, fecha_fin:Date): Observable<ResponseDto<MotivoNoVisitaDto>> {
        const url = `${this.apiUrl}/monitoreo/motivo-no-visita`;
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };
        return this.http.post<ResponseDto<MotivoNoVisitaDto>>(url,{fecha_inicio :"01-11-2025", fecha_fin:"11-11-2025"}, httpOptions);
    }
    getRiesgoAbandonoReporte(): Observable<ResponseDto<RiesgoAbandonoDto[]>> {
        const url = `${this.apiUrl}/monitoreo/riesgo-abandono`;
        return this.http.get<ResponseDto<RiesgoAbandonoDto[]>>(url);
    }
}