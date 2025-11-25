export interface MotivoDto{
    motivo?: string;
    cantidad?: number;
}

export interface MotivoNoVisitaDto {
    total_citas?: Number;
    motivos?: MotivoDto[];
}