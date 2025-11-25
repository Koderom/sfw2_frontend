import { PacienteDto } from "./paciente.dto";

export interface MetricasRiesgoAbandonoDto {
  T?: number;
  M?: number;
  missRate?: number;
  missRuns?: number;
  dispersionIndex?: number;
  longestGapNormalized?: number;
  riskScore?: number;
  nivel?: string;
}

export interface RiesgoAbandonoDto {
    paciente: PacienteDto;
    tratamientoId: string;
    metricas: MetricasRiesgoAbandonoDto;
}