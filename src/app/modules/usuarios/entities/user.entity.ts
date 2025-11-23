import { RolDto } from "../dto/rol.dto";
import { UserDto } from "../dto/user.dto";


export class Rol {
    id?: string;
    descripcion: string;

    constructor(dto: RolDto) {
        this.id = dto.id || '';
        this.descripcion = dto.descripcion;
    }

    toDto(): RolDto {
        return {
            id: this.id,
            descripcion: this.descripcion
        };
    }
}

export class User {
  id?: string;
  username: string;
  contrasena: string;
  nombre: string;
  email: string;
  telefono: string;
  notificarEmail: boolean;
  notificarWhatsapp: boolean;
  estado: boolean;
  fechaLogin: string | null = null;
  createdAt: string | null = null;
  updatedAt: string | null = null;
  rol: Rol;

  constructor(dto: UserDto) {
    this.id = dto.id || crypto.randomUUID();
    this.username = dto.username || '';
    this.contrasena = dto.contrasena || '';
    this.nombre = dto.nombre || '';
    this.email = dto.email || '';
    this.telefono = dto.telefono || '';
    this.notificarEmail = dto.notificar_email ?? true;
    this.notificarWhatsapp = dto.notificar_whatsapp ?? true;
    this.estado = dto.estado ?? true;
    this.fechaLogin = dto.fecha_login || null;
    this.createdAt = dto.created_at || new Date().toISOString();
    this.updatedAt = dto.updated_at || new Date().toISOString();
    this.rol = dto.rol ? new Rol(dto.rol) : new Rol({ descripcion: 'No definido' });
  }

  toDto(): UserDto {
    return {
      id: this.id,
      username: this.username,
      contrasena: this.contrasena,
      nombre: this.nombre,
      email: this.email,
      telefono: this.telefono,
      notificar_email: this.notificarEmail,
      notificar_whatsapp: this.notificarWhatsapp,
      estado: this.estado,
      fecha_login: this.fechaLogin,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
      rol: this.rol.toDto()
    };
  }
}