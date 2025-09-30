import { EstadoTratamientoDto } from "./estadotratamiento.dto";
import { PacienteDto } from "./paciente.dto";
import { TipoTratamientoDto } from "./tipotratamiento.dto";

export interface TratamientoDto{
    id?: string;
    fecha_inicio?: Date;
    fecha_fin?: Date;
    paciente?: PacienteDto;
    idPaciente?: string;
    tipo_tratamiento?: TipoTratamientoDto;
    idTipoTratamiento?: string;
    estado?: EstadoTratamientoDto;
    idEstado?: string;
    observaciones?: string;
}