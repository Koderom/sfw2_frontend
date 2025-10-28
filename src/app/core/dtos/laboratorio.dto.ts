import { Paciente } from "@/modules/paciente";
import { TipoControlDto } from "./tipocontrol.dto";
import { TipoLaboratorioDto } from "./tipolaboratorio.dto";
import { TipoResultadoDto } from "./tiporesultado.dto";

export interface LaboratorioDto {
    id? : string;
    codigo? : string;
    fecha?: Date;
    observacion? : string;

    idTipoLaboratorio? : string;
    idTipoControl? : string;
    idTipoResultado? : string;
    idPaciente? : string;

    tipoLaboratorio? : TipoLaboratorioDto;
    tipoControl? : TipoControlDto;
    tipoResultado? : TipoResultadoDto;
    paciente?: Paciente;
}