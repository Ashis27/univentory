import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from 'src/app/_models';
import { UserService } from 'src/app/_services/componentservice';
import { LanguageHandlerService } from 'src/app/shared/handler/language.service';
import { ApiServicesHandlerService } from 'src/app/shared/handler/app.constant';
import { CreateAdminComponent } from 'src/app/hiroshimaadmin/adminlayout/pagecomponent/super-admin/create-admin/create-admin.component';

/**
 * Transaction information component
 */
@Component({ templateUrl: 'app-transaction-info.component.html' })

export class AppTransactionInfoComponent extends LanguageHandlerService implements OnInit {

    /**
     * @ignore
     */
    constructor(injector: Injector, private userService: UserService) {
        super(injector);
    }

    /**
     * Initial entry point
     * @example
     * ngOnInit()
     */
    ngOnInit(): void {
       
    }
}