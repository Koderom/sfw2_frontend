import { inject, Injectable } from "@angular/core";
import { environment} from "../../../environments/environment" 
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ResponseDto } from "@/core/dtos/response.dto";
import { PacienteDto } from "@/core/dtos/paciente.dto";
import { ZonaUvDto } from "../dtos/zonaUv.dto";

@Injectable({providedIn: 'root'})
export class DireccionSerivce{
    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);



    getAllZonasUv(): Observable<ResponseDto<ZonaUvDto[]>>{
        const url = `${this.apiUrl}/direccion/zona-uv`;
        return this.http.get<ResponseDto<ZonaUvDto[]>>(url);
    }

    // crearPaciente(paciente: PacienteDto): Observable<ResponseDto<PacienteDto>> {
    //     const url = `${this.apiUrl}/paciente`;
    //     const httpOptions = {
    //         headers: new HttpHeaders({'Content-Type': 'application/json'})
    //     };
    //     return this.http.post<any>(url, paciente, httpOptions);
    // }

    // getAllPacientes(): Observable<ResponseDto<PacienteDto[]>> {
    //     const url = `${this.apiUrl}/paciente`;
    //     return this.http.get<ResponseDto<PacienteDto[]>>(url);
    // }
}