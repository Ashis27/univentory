import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "../adminlayout/adminlayout.component";
import { AuthGuardService as AuthGuard }  from "../../_guards";
import { LoginComponent } from "./login";

export const AuthLayoutRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: LoginComponent
            },
        ]
    },
]
