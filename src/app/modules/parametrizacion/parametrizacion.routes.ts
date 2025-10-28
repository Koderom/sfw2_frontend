import { Routes } from "@angular/router";
import { Motivos } from "./motivos/motivos";
import { Parametrizacion } from "./parametrizacion";

export default [
    {path: '',component: Parametrizacion,},
    {path: 'motivo-inasistencia', component: Motivos}
    
] as Routes