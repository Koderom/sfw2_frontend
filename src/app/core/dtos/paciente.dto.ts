import { Sintomas } from "@/modules/parametrizacion/sintomas/sintomas";
import { ContactoDto } from "./contacto.dto";
import { DireccionDto } from "./direccion.dto";
import { EnfermedadDto } from "./enfermedad.dto";
import { SintomaDto } from "./sintoma.dto";

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

    enfermedades?: EnfermedadDto[];
    sintomas?: SintomaDto[];
}