import { RolDto } from "./rol.dto";

export interface UserDto{
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
    created_at: string | null;
    updated_at: string | null;
    rol: RolDto;
}