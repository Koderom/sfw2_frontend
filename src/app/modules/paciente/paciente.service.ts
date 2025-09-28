import { inject, Injectable } from "@angular/core";
import { environment} from "../../../environments/environment" 
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ResponseDto } from "@/core/dtos/response.dto";
import { PacienteDto } from "@/core/dtos/paciente.dto";
import { PacienteDetailDto } from "@/core/dtos/pacientedetail.dto";
import { ParentescoDto } from "@/core/dtos/parentesco.dto";
import { ContactoDto } from "@/core/dtos/contacto.dto";

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

    crearContactoPaciente(contacto: ContactoDto): Observable<ResponseDto<ContactoDto>> {
        const url = `${this.apiUrl}/paciente/contacto/${contacto.id_paciente}`;
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };
        return this.http.post<ResponseDto<ContactoDto>>(url, contacto, httpOptions);
    }

    actualizarContactoPaciente(contacto: ContactoDto): Observable<ResponseDto<ContactoDto>> {
        const url = `${this.apiUrl}/paciente/contacto/${contacto.id}`;
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };
        return this.http.put<ResponseDto<ContactoDto>>(url, contacto, httpOptions);
    }

    getContactosByPacienteId(idPaciente: string): Observable<ResponseDto<ContactoDto[]>> {
        const url = `${this.apiUrl}/paciente/contacto/${idPaciente}`;
        return this.http.get<ResponseDto<ContactoDto[]>>(url);
    }

    

    actualizarPaciente(paciente: PacienteDto): Observable<ResponseDto<PacienteDto>> {
        const url = `${this.apiUrl}/paciente/${paciente.id}`;
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };
        return this.http.put<ResponseDto<PacienteDto>>(url, paciente, httpOptions);
    }

    getPacicienteById(idPaciente: string): Observable<ResponseDto<PacienteDetailDto>> {
        const url = `${this.apiUrl}/paciente/${idPaciente}`;
        return this.http.get<ResponseDto<PacienteDetailDto>>(url);
    }

    getAllPacientes(): Observable<ResponseDto<PacienteDto[]>> {
        const url = `${this.apiUrl}/paciente`;
        return this.http.get<ResponseDto<PacienteDto[]>>(url);
    }

    getAllTipoParentesco(): Observable<ResponseDto<ParentescoDto[]>> {
        const url = `${this.apiUrl}/paciente/tipo-parentesco`;
        return this.http.get<ResponseDto<ParentescoDto[]>>(url);
    }
}