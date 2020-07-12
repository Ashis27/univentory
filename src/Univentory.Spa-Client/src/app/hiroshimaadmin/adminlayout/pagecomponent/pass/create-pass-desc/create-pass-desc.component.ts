import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

import * as _ from "lodash";
import { Router } from '@angular/router';
import { LanguageHandlerService } from 'src/app/shared/handler/language.service';
import { IAdminUser } from 'src/app/shared/interfaces/IAdminUser';
import { AdminUser } from 'src/app/shared/models/AdminUser';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Role } from 'src/app/shared/enum/role';
import { PTOServiceProvider, ConfigurationServiceProvider, PassServiceProvider } from 'src/app/_services/componentservice';
import { first } from 'rxjs/operators';
import { ApiServicesHandlerService } from 'src/app/shared/handler';
import { LanguageService } from 'src/app/shared/interfaces';
import { PTOModel, PTODescriptionModel, PassDescriptionModel, PassModel, SearchParams } from 'src/app/shared/models';
import { moment } from 'ngx-bootstrap/chronos/test/chain';

/**
 * Create pass description component
 */
@Component({
    selector: 'create-pass-desc-modal',
    templateUrl: './create-pass-desc.component.html'
})

export class AddPassDescComponent extends LanguageHandlerService implements OnInit {

    
    /**
    * Edit pass description modal
    */
    @ViewChild('editPassDescModal') modal: ModalDirective;
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
     * Value of the saving status
     */
    saving: boolean = false;
    /**
     * Value of the pass description form group object
     */
    addPassDescForm: FormGroup;
     /**
     * Value of the pass having PTO model
     */
    passDesc: PassDescriptionModel[] = [];
    /**
     * Value of the pass information model
     */
    createNewPass: PassModel = {
        Id: 0,
        DefaultCurrency: 0,
        PassValidityInDays: 0,
        PassValidityInHours: 0,
        PassExpiredDurationInDays: 0,
        PassExpiredDurationInHours: 0,
        PassExpiredDate: "",
        AdultPrice: 0,
        ChildPrice: 0,
        ImageURL: "",
        Remark: "",
        IsActive: true,
        PassDescription: this.passDesc,
        PassActivePTOs: []
    }
   /**
     * Value of the minimum date to be shown in date picker
     */
    minDate: Date;
    /**
     * Value of the active PTOs model
     */
    activePTOs: any = [];

    /**
    Value of available status 
    */
    isAvaileble: boolean = true;

        /**
     * Value of the active currencies
     */
    activeCurrencies: any = [];

    /**
     * Value of the form submit status
     */
    submitted = false;

    /**
    Value of the LanguageService which contain selected language with all static label contents and all active languages
    */
    _languages: LanguageService = {
        languages: [],
        currentLanguage: Object.assign({}),
        currentLangContents: null
    };

    /**
     * @ignore
     */
    constructor(
        injector: Injector,
        private router: Router,
        private formBuilder: FormBuilder,
        private passService: PassServiceProvider,
        private _config_service: ConfigurationServiceProvider,
        private ptoService: PTOServiceProvider
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
        this.addPassDescForm = this.formBuilder.group({
            id: [0],
            passInformationId: [0],
            passName: ['', Validators.required],
            passDesc: ['', Validators.required],
            passAreaDescription: ['', Validators.required],
            passAreaImageURL: [''],
            selectedLanguage: ['', Validators.required],
            isPerkAvailable: [false],
            perkDescription: [''],
            isActive: [true],
        }, );
    }
    
    /**
     * Convenience getter for easy access to form fields
     * @example
     * f()
     * @returns {void}
     */
    get f() { return this.addPassDescForm.controls; }
   
     /**
     * To open modal with auto fill value
     */
    show(passInfo:any): void {
        this.ngOnInit();
        if (passInfo.id <= 0)
            return this._custom_message_handler.errorMessage(this.lang("InvalidPassInformation"));
        this.active = true;
        this.modal.show();
        this.createNewPass.Id = passInfo.id;
        this.createNewPass.PassExpiredDate = passInfo.PassExpiredDate;
        (<FormControl>this.f['passInformationId']).setValue(passInfo.id);
        this.getAvailableLanguages(passInfo.id);
        // Object.assign({}, this.contactForm.value);
    }
    
      /**
    * To save new pass description
    * @example
    * save()
    * @param {object} passInformation pass description
    * @returns {void}
    */
    save(): void {
        this.createNewPass.PassDescription = [];
        this.submitted = true;
        // stop here if form is invalid
        if (this.addPassDescForm.invalid)
            return;
        if (this.f.isPerkAvailable.value && !this.f.perkDescription.value)
            return;

        this.createNewPass.PassDescription.push(this.addPassDescForm.value);
        this.passService.UpdatePass(this.createNewPass)
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
    * To get currencies
    * @example
    * getActiveLanguages
    * @param {boolean} status True | False (Use loader or not)
    * @returns {List} languages
    */
    getAvailableLanguages(id: number) {
        this._languages.languages = [];
        this.passService.GetAvailableLanguages(id)
            .subscribe(response => {
                if (!response || response.length == 0)
                    return this._custom_message_handler.errorMessage(this.lang('NoLanguagesAvailableToAddDescription'));
                this._languages.languages = response;
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
