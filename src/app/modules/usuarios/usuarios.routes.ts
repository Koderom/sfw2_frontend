import { Routes } from "@angular/router";
import { Login } from "@/pages/auth/login";
import { UserTable } from "./components/user-table/user-table";
import { Usuarios } from "./usuarios";

export default [
    {path: '',component: Usuarios,},
    // {path: 'detail-paciente/:id', component: DetailPaciente}
] as Routes