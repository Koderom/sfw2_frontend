import { Routes } from "@angular/router";
import { Paciente } from "./paciente";

export default [
    {
        path: '',
        component: Paciente,
        children: []
    }
] as Routes