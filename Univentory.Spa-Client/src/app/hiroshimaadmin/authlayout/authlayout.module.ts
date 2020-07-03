import { AdminLayoutComponent } from "../adminlayout/adminlayout.component";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AuthLayoutRoutes } from "../authlayout/authlayout.routing";
import { LoginComponent } from "../authlayout/login";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        RouterModule.forChild(AuthLayoutRoutes),
        ReactiveFormsModule,
        CommonModule
    ],
    declarations: [
        LoginComponent
    ],
    providers: [
        // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
      ],
})

export class AuthLayoutModule {}