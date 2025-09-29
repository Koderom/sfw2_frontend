import { ContactoDto } from "./contacto.dto";
import { DireccionDto } from "./direccion.dto";

export interface PacienteDto {
    id?: string;
    nombre?: string;
    numero_doc?: string;
    tipo_doc?: number;
    fecha_nacimiento?: Date;
    genero?: number;
    email?: string;
    tiene_whatsapp?: boolean;
    telefono?: number;
    estado?: boolean;
    contactos?: ContactoDto[];
    direccion?: DireccionDto;
}