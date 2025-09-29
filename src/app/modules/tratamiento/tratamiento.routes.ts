import { Routes } from "@angular/router";
import { Tratamiento } from "./tratamiento";
import { DetailTratamiento } from "./detail-tratamiento/detail-tratamiento";

export default [
    {path: '',component: Tratamiento,},
    {path: 'detail-tratamiento/:id', component: DetailTratamiento}
    
] as Routes