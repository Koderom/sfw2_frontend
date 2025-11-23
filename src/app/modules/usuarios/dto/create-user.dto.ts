import { RolDto } from "./rol.dto";

export interface CreateUserDto{
    id?: string;
    username: string;
    contrasena: string;
    nombre: string;
    fecha_login: string | null;
    estado: boolean;
    email: string;
    telefono: string;
    notificar_email: boolean;
    notificar_whatsapp: boolean;
    idRol: string;
}