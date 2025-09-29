import { PacienteDto } from "./paciente.dto";

export interface TratamientoDto{
    id?: string;
    fecha_inicio?: Date;
    fecha_fin?: Date;
    paciente?: PacienteDto;
    idPaciente?: string;
    idTipoTratamiento?: string;
    idEstado?: string;
    observaciones?: string;
}