import { ParentescoDto } from "./parentesco.dto";

export interface ContactoDto{
    id?: string;
    nombre_contacto?: string;
    id_paciente?: string;
    id_tipo_parentesco?: string;
    tipo_parentesco?: ParentescoDto;
    numero_telefono_contacto?: string;
    direccion?: string;
    emergencia?: boolean;
    tiene_whatsapp?: boolean;
}