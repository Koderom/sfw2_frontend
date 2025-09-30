import { Routes } from "@angular/router";
import { Tratamiento } from "./tratamiento";
import { DetailTratamiento } from "./detail-tratamiento/detail-tratamiento";
import { CitasTratamiento } from "./citas-tratamiento/citas-tratamiento";

export default [
    {path: '',component: Tratamiento,},
    {path: 'detail-tratamiento/:id', component: DetailTratamiento},
    {path: 'citas-tratamiento/:id', component: CitasTratamiento}
] as Routes