import { inject, Injectable } from "@angular/core";
import { environment} from "../../../environments/environment" 
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ResponseDto } from "@/core/dtos/response.dto";
import { PacienteDto } from "@/core/dtos/paciente.dto";

@Injectable({providedIn: 'root'})
export class PacienteService{
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    crearPaciente(paciente: PacienteDto): Observable<ResponseDto<PacienteDto>> {
        const url = `${this.apiUrl}/paciente`;
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };
        return this.http.post<ResponseDto<PacienteDto>>(url, paciente, httpOptions);
    }

    getAllPacientes(): Observable<ResponseDto<PacienteDto[]>> {
        const url = `${this.apiUrl}/paciente`;
        return this.http.get<ResponseDto<PacienteDto[]>>(url);
    }
}