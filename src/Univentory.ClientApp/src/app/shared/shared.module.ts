// include directives/components commonly used in features modules in this shared modules
// and import me into the feature module
// importing them individually results in: Type xxx is part of the declarations of 2 modules: ... Please consider moving to a higher module...
// https://github.com/angular/angular/issues/10646  

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpService } from './services/http.service';
import { StorageService } from './services/storage.service';
import { NotificationService } from './services/notification.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AuthService } from './authentication/auth.service';
import { ConfigService } from './services/config.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthGuardService } from './authentication/auth.guard';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserModule } from '@angular/platform-browser';
import { OnlyNumberDirective } from './directive/only-number.directive';
import { NumberDirective } from './directive/numbers-only.directive';
import { AlertmodalpopupComponent } from './component/alertmodalpopup/alertmodalpopup.component';

//https://stackoverflow.com/questions/41433766/directive-doesnt-work-in-a-sub-module
//https://stackoverflow.com/questions/45032043/uncaught-error-unexpected-module-formsmodule-declared-by-the-module-appmodul/45032201

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  declarations: [
    NumberDirective
  ],
  exports: [NgxSpinnerModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: LoadingScreenInterceptor, multi: true },
    ConfigService,
    HttpService,
    StorageService,
    NotificationService,
    AuthService,
    AuthGuardService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }