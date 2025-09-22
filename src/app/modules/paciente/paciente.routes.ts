import { Routes } from "@angular/router";
import { Paciente } from "./paciente";
import { DetailPaciente } from "./detail-paciente/detail-paciente";

export default [
    {path: '',component: Paciente,},
    {path: 'detail-paciente/:id', component: DetailPaciente}
    
] as Routes