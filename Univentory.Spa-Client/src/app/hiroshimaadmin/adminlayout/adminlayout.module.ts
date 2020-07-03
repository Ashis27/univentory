import { AdminLayoutComponent } from "./adminlayout.component";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
// import { HTTP_INTERCEPTORS } from "@angular/common/http";
// import { ErrorInterceptor, JwtInterceptor } from "./_helpers";
import { AdminLayoutRoutes } from "./adminlayout.routing";
import { SidebarComponent } from "./sidenav/sidenav.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { ModalModule, BsDatepickerModule } from 'ngx-bootstrap'

@NgModule({
    imports: [
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot()
    ],
    declarations: [
        SidebarComponent,
    ],
    providers: [
    ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA]
})

export class AdminLayoutComponentModule { }