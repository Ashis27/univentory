import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from 'src/app/_models';
import { UserService, ConfigurationServiceProvider, AdminServiceProvider } from 'src/app/_services/componentservice';
import { LanguageHandlerService } from 'src/app/shared/handler/language.service';
import { ApiServicesHandlerService } from 'src/app/shared/handler/app.constant';
import { CreateAdminComponent } from 'src/app/hiroshimaadmin/adminlayout/pagecomponent/super-admin/create-admin/create-admin.component';
import { CurrencyModule } from 'src/app/shared/models/CurrencyModule';
import { SearchParams } from 'src/app/shared/models';
import { CreateSuperAdminUser } from 'src/app/hiroshimaadmin/adminlayout/pagecomponent/nec-admin/create-superadmin/create-superadmin.component';
import { EditSuperAdminUser } from 'src/app/hiroshimaadmin/adminlayout/pagecomponent/nec-admin/edit-superadmin/edit-superadmin.component';


/**
 * NEC user component
 */
@Component({ templateUrl: 'nec-user.component.html' })

export class NECUserComponent extends LanguageHandlerService implements OnInit {

     /**
     * Create super admin user modal
     */
    @ViewChild('createSuperAdminModal') createSuperAdminModal: CreateSuperAdminUser;

     /**
     * Edit super admin user modal
     */
    @ViewChild('editSuperAdminModal') editSuperAdminModal: EditSuperAdminUser;

    /**
     * Value of the  admin user model information
     */
    activeUsers: any = [];
     /**
    Value of SearchParams model for pagination 
    */   
   searchParams: SearchParams = { PageIndex: 1, PageSize: 10, Lang: 0 };
    
   /**
    * Value of the available status
    */ 
   isAvaileble: boolean = true;

   /**
    * @ignore
    */
    constructor(injector: Injector, private adminService: AdminServiceProvider) {
        super(injector);
    }

    /**
     * Initial entry point
     * @example
     * ngOnInit()
     * @returns {void}
     */
    ngOnInit(): void {
        this.refresh();
    }

    /**
     * Refresh active user information
     * @example
     * refresh()
     * @returns {void}
     */
    refresh() {
        this.getActiveUsers();
    }
  
    /**
     * To get active user information
     * @example
     * getActiveUsers()
     * @returns {List} active user information
     */
    getActiveUsers() {
        this.activeUsers=[];
        const currentUser = this._authenticationService.currentUserValue;
        this.adminService.GetSuperAdmins(currentUser.id)
            .pipe(first())
            .subscribe(response => {
                if (!response || response.length == 0)
                    return this.isAvaileble = false;
                this.activeUsers = response;
                this.isAvaileble = true;
            },
                error => {
                    this._custom_message_handler.errorMessage(this.lang(error));
                });

    }

    /**
     * To create new user modal
     */
    createUser(): void {
        this.createSuperAdminModal.show();
    }

    /**
     * To edit existing user modal
     */
    editUser(item): void {
        this.editSuperAdminModal.show(item);
    }

    /**
     * To delete user 
     */
    deleteUser(): void {

    }

}