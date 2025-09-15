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
}