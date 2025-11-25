import { Routes } from "@angular/router";
import { MapaCalor } from "./mapa-calor/mapa-calor";
import { RiesgoAbandonoReporte } from "./riesgo-abandono-reporte/riesgo-abandono-reporte";

export default [
    {path: '',component: MapaCalor,},
    {path: 'mapa-calor', component: MapaCalor},
    {path: 'riesgo-abandono', component: RiesgoAbandonoReporte}
    
] as Routes