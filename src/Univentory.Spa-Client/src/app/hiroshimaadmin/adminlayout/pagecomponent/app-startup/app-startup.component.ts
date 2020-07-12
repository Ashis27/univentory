import { Component, Injector, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from 'src/app/_models';
import { LanguageHandlerService } from 'src/app/shared/handler/language.service';
import { UserService } from 'src/app/_services/componentservice/user.service';
import { ApiServicesHandlerService } from 'src/app/shared/handler/app.constant';
import { LanguageService } from 'src/app/shared/interfaces';
import { Role } from 'src/app/shared/enum/role';
import { Router } from '@angular/router';


/**
 * App start up component
 */
@Component({ templateUrl: 'app-startup.component.html' })

export class AppStartUpComponent extends LanguageHandlerService implements OnInit {

    /**
     * @ignore
    */
    constructor(
        Injector: Injector,
        public router: Router
    ) {
        super(Injector);
    }

    
    /**
     * Initial entry point
     * @example
     * ngOnInit()
     * @returns {void}
     */
    ngOnInit() {
        //this.getCurrentLangInfoFromCache();
        this.redirectByRole();
    }
  
    
    /**
     * redirect page based on role
     * @example
     * redirectByRole()
     * @returns {void}
     */
    redirectByRole() {
        const tokenPayload: any = this._authenticationService.decodeToken();
        if (tokenPayload.role == Role.NECAdmin)
            this.router.navigate(['/dashboard/super-admin-user']);
        else if (tokenPayload.role == Role.SuperAdmin)
            this.router.navigate(['/dashboard/active-pass']);
        else if (tokenPayload.role == Role.Admin)
            this.router.navigate(['/dashboard/active-pass']);
    }

}