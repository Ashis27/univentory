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
import { EditAdminUserComponent } from 'src/app/hiroshimaadmin/adminlayout/pagecomponent/super-admin/edit-admin/edit-admin.component';


/**
 * Super admin user component
 */
@Component({ templateUrl: 'superadmin-user.component.html' })

export class SuperAdminUserComponent extends LanguageHandlerService implements OnInit {
    /**
     * Create admin user modal
     */
    @ViewChild('createAdminModal') createAdminModal: CreateAdminComponent;
    /**
     * Edit admin user modal
     */
    @ViewChild('editAdminModal') editAdminModal: EditAdminUserComponent;
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
        this.activeUsers = [];
        const currentUser = this._authenticationService.currentUserValue;
        this.adminService.GetAdmins(currentUser.id)
            .pipe(first())
            .subscribe(response => {
                if (!response || response.length == 0)
                    return this.isAvaileble = false;;
                this.activeUsers = response;
                this.isAvaileble = true;
            },
                error => {
                    this.isAvaileble = false;
                    this._custom_message_handler.errorMessage(this.lang(error));
                });

    }

    /**
     * To update admin user active status
     * @example
     * changeAction({currentInfo})
     * @param {object} item selected admin user information
     * @returns {boolean} True | False 
     */
    changeAction(item) {
        if (confirm(this.lang("ConfirmUpdate"))) {
            const currentUser = this._authenticationService.currentUserValue;
            item.isActive = !item.isActive;
            this.adminService.UpdateAdmin(item, currentUser.id)
                .pipe(first())
                .subscribe(response => {
                    if (!response.success)
                        return this._custom_message_handler.errorMessage(this.lang(response.message));;
                    this._custom_message_handler.successMessage(this.lang(response.message));
                },
                    error => {
                        this._custom_message_handler.errorMessage(this.lang(error));
                    });
        }
    }

    /**
     * To create new user modal
     */
    createUser(): void {
        this.createAdminModal.show();
    }

    /**
    * To edit existing user modal
    */
    editUser(item): void {
        this.editAdminModal.show(item);
    }


    /**
     * To delete admin user active status 
     * @example
     * deleteUser(1)
     * @param {number} id selected admin user id
     * @returns {boolean} True | False
     */
    deleteUser(id: number): void {
        if (confirm(this.lang("ConfirmUpdate"))) {
            const currentUser = this._authenticationService.currentUserValue;
            this.adminService.DeleteAdmin(currentUser.id, id)
                .pipe(first())
                .subscribe(response => {
                    if (!response.status)
                        return this._custom_message_handler.errorMessage(this.lang(response.message));;
                    this._custom_message_handler.successMessage(this.lang(response.message));
                },
                    error => {
                        this._custom_message_handler.errorMessage(this.lang(error));
                    });
        }
    }
}