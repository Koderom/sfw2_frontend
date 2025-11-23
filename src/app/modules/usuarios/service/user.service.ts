import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { ResponseDto } from "@/core/dtos/response.dto";
import { environment } from "src/environments/environment";
import { UserDto } from "../dto/user.dto";
import { RolDto } from "../dto/rol.dto";
import { CreateUserDto } from "../dto/create-user.dto";

@Injectable({ providedIn: 'root' })
export class UserService {

    private apiUrl = environment.apiUrl;
    private http = inject(HttpClient);

    getAllUsers(): Observable<ResponseDto<UserDto[]>> {
        const url = `${this.apiUrl}/user`;
        return this.http.get<ResponseDto<UserDto[]>>(url);
    }

    // getUserById(id: string): Observable<ResponseDto<UserDto>> {
    //     const url = `${this.apiUrl}/user/${id}`;
    //     return this.http.get<ResponseDto<UserDto>>(url);
    // }

    createUser(user: CreateUserDto): Observable<ResponseDto<UserDto>> {
        const url = `${this.apiUrl}/user`;
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return this.http.post<ResponseDto<UserDto>>(url, user, httpOptions);
    }

    updateUser(id: string, user: CreateUserDto): Observable<ResponseDto<UserDto>> {
        const url = `${this.apiUrl}/user/${id}`;
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return this.http.put<ResponseDto<UserDto>>(url, user, httpOptions);
    }

    getAllRoles(): Observable<ResponseDto<RolDto[]>> {
        const url = `${this.apiUrl}/user/rol`;
        return this.http.get<ResponseDto<RolDto[]>>(url);
    }

    // getRolById(id: string): Observable<ResponseDto<RolDto>> {
    //     const url = `${this.apiUrl}/user/rol/${id}`;
    //     return this.http.get<ResponseDto<RolDto>>(url);
    // }

    // createRol(rol: CreateRolDto): Observable<ResponseDto<RolDto>> {
    //     const url = `${this.apiUrl}/user/rol`;
    //     const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    //     return this.http.post<ResponseDto<RolDto>>(url, rol, httpOptions);
    // }

    // updateRol(id: string, rol: UpdateRolDto): Observable<ResponseDto<RolDto>> {
    //     const url = `${this.apiUrl}/user/rol/${id}`;
    //     const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    //     return this.http.put<ResponseDto<RolDto>>(url, rol, httpOptions);
    // }
}
