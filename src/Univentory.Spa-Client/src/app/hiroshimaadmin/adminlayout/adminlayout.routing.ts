import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./adminlayout.component";
import { AuthGuardService as AuthGuard } from "../../_guards";
import { RoleGuardService as RoleGuard } from '../../_guards/role.guard.service';
import { Role } from "../../shared/enum/role";
import { AppStartUpComponent } from "./pagecomponent/app-startup";
import { AppCurrencyComponent } from "./pagecomponent/app-currency/app-currency.component";
import { NECUserComponent } from "./pagecomponent/nec-admin/nec-user/nec-user.component";
import { AppLanguageComponent } from "./pagecomponent/app-language/app-language.component";
import { SuperAdminUserComponent } from "./pagecomponent/super-admin/superadmin-user/superadmin-user.component";
import { AppBookingInfoComponent } from "./pagecomponent/app-booking-info/app-booking-info.component";
import { PTOComponent } from "./pagecomponent/pto";
import { PassComponent } from "./pagecomponent/pass";
import { AppFeedbackComponent } from "./pagecomponent/app-feedback/app-feedback.component";
import { QRCodeConfigurationComponent } from "./pagecomponent/qr-configuration";


export const AdminLayoutRoutes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                component: AppStartUpComponent
            },
            {
                path: 'super-admin-user',
                component: NECUserComponent,
                canActivate: [RoleGuard],
                data: {
                    expectedRole: [Role.NECAdmin]
                }
            },
            {
                path: 'currency',
                component: AppCurrencyComponent,
                canActivate: [RoleGuard],
                data: {
                    expectedRole: [Role.Admin, Role.SuperAdmin]
                }
            },
            {
                path: 'language',
                component: AppLanguageComponent,
                canActivate: [RoleGuard],
                data: {
                    expectedRole: [Role.Admin, Role.SuperAdmin]
                }
            },
            {
                path: 'admin-user',
                component: SuperAdminUserComponent,
                canActivate: [RoleGuard],
                data: {
                    expectedRole: [Role.SuperAdmin]
                }
            },
            {
                path: 'booking-info',
                component: AppBookingInfoComponent,
                canActivate: [RoleGuard],
                data: {
                    expectedRole: [Role.Admin, Role.SuperAdmin]
                }
            },
            {
                path: 'feedback-info',
                component: AppFeedbackComponent,
                canActivate: [RoleGuard],
                data: {
                    expectedRole: [Role.Admin, Role.SuperAdmin]
                }
            },
            {
                path: 'configuration-info',
                component: QRCodeConfigurationComponent,
                canActivate: [RoleGuard],
                data: {
                    expectedRole: [Role.Admin, Role.SuperAdmin]
                }
            },
            {
                path: 'active-pto',
                component: PTOComponent,
                canActivate: [RoleGuard],
                data: {
                    expectedRole: [Role.Admin, Role.SuperAdmin]
                }
            },
            {
                path: 'active-pass',
                component: PassComponent,
                canActivate: [RoleGuard],
                data: {
                    expectedRole: [Role.Admin, Role.SuperAdmin]
                }
            },
            { path: '**', redirectTo: '' },
        ]
    }
];
