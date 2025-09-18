import { DireccionDto } from "./direccion.dto";
import { PacienteDto } from "./paciente.dto";

export interface PacienteDetailDto{
    paciente: PacienteDto;
    direccion: DireccionDto;
}