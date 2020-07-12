import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

import * as _ from "lodash";
import { Router } from '@angular/router';
import { LanguageHandlerService } from 'src/app/shared/handler/language.service';
import { IAdminUser } from 'src/app/shared/interfaces/IAdminUser';
import { AdminUser } from 'src/app/shared/models/AdminUser';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { first } from 'rxjs/operators';
import { Role } from 'src/app/shared/enum/role';
import { AdminServiceProvider } from 'src/app/_services/componentservice';


/**
 * Edit super admin user component
 */
@Component({
    selector: 'edit-super-admin-modal',
    templateUrl: './edit-superadmin.component.html'
})

export class EditSuperAdminUser extends LanguageHandlerService implements OnInit {

     /**
     * Edit super admin user modal
     */
    @ViewChild('editSuperAdminModal') modal: ModalDirective;

     /**
     * Modal content object referrence to play with the modal
     */
    @ViewChild('modalContent') modalContent: ElementRef;

    /**
     * Output decoration
     */
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Value of the active status
     */
    active: boolean = false;

    /**
     * Value of the save status
     */
    saving: boolean = false;

    /**
     * Admin user Form object
     */
    adminUserForm: FormGroup

    /**
     * Value of the submit status
     */
    submitted = false;

    /**
     * @ignore
     */
    constructor(
        injector: Injector,
        private router: Router,
        private formBuilder: FormBuilder,
        private _admin_service: AdminServiceProvider
    ) {
        super(injector);
    }

       /**
     * Initial entry point
     * @example
     * ngOnInit()
     * @returns {void}
     */
    ngOnInit(): void {
        this.adminUserForm = this.formBuilder.group({
            id: [0],
            userName: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
            isActive: [true],
            role: [Role.SuperAdmin],
        }, );
    }
    
    
    /**
     * Admin user form group control value
     * @example
     * f()
     * @returns {void}
     */
    get f() { return this.adminUserForm.controls; }
    
    /**
     * To open modal with auto fill value
     */
    show(userData: any): void {
        if (!userData)
            return this._custom_message_handler.errorMessage("UserDataNotNull");
        (<FormControl>this.f['id']).setValue(userData.id);
        (<FormControl>this.f['userName']).setValue(userData.userName);
        (<FormControl>this.f['password']).setValue("");
        (<FormControl>this.f['confirmPassword']).setValue("");
        (<FormControl>this.f['isActive']).setValue(userData.isActive);
        this.active = true;
        this.modal.show();
    }
    
    /**
    * To update new super admin information
    * @example
    * save()
    * @param {object} Admin user model
    * @returns {void}
    */
    save(): void {
        this.submitted = true;
        // stop here if form is invalid
        if (this.adminUserForm.invalid)
            return;
        if (this.f.password.value != this.f.confirmPassword.value)
            return this._custom_message_handler.errorMessage(this.lang("PasswordDoesnotMatch"));
        const currentUser = this._authenticationService.currentUserValue;
        this._admin_service.UpdateSuperAdmin(this.adminUserForm.value, currentUser.id)
            .pipe(first())
            .subscribe(response => {
                if (!response.success)
                    return this._custom_message_handler.errorMessage(this.lang(response.message));
                this._custom_message_handler.successMessage(this.lang(response.message));
                this.close();
                this.modalSave.emit(null);
            },
                error => {
                    this._custom_message_handler.errorMessage(this.lang(error));
                });
    }

    /**
     * To close modal after complete an action
     */
    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
