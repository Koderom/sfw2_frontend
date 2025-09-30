import { EstadoCitaDto } from "./estadocita.dto";
import { TipoCitaDto } from "./tipocita.dto";

export interface CitaDto {
	id?: string;
	idTratamiento?: string;
	fecha_programada?: Date;
	fecha_actual?: Date;
	idEstado?: string;
	estado?: EstadoCitaDto;
	idTipo?: string;
	tipo?: TipoCitaDto;
	observaciones?: string;
	idUser?: string;
}