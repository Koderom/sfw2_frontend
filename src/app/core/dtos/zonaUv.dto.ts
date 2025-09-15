import { ZonaMzDto } from "./zonaMz.dto";

export interface ZonaUvDto{
    id?: string;
    descripcion?: string;
    vertices?: string;
    manzanos?: ZonaMzDto[]
}