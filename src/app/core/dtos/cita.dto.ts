import { EstadoCitaDto } from "./estadocita.dto";
import { TipoCitaDto } from "./tipocita.dto";
import { TratamientoDto } from "./tratamiento.dto";

export interface CitaDto {
	id?: string;
	idTratamiento?: string;
	tratamiento?: TratamientoDto;
	fecha_programada?: Date;
	fecha_actual?: Date;
	idEstado?: string;
	estado?: EstadoCitaDto;
	idTipo?: string;
	tipo?: TipoCitaDto;
	observaciones?: string;
	idUser?: string;
	idMotivo?: string;
}