import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

import * as _ from "lodash";
import { Router } from '@angular/router';
import { LanguageHandlerService } from 'src/app/shared/handler/language.service';
import { IAdminUser } from 'src/app/shared/interfaces/IAdminUser';
import { AdminUser } from 'src/app/shared/models/AdminUser';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Role } from 'src/app/shared/enum/role';
import { PTOServiceProvider, ConfigurationServiceProvider } from 'src/app/_services/componentservice';
import { first } from 'rxjs/operators';
import { ApiServicesHandlerService } from 'src/app/shared/handler';
import { LanguageService } from 'src/app/shared/interfaces';
import { PTOModel, PTODescriptionModel } from 'src/app/shared/models';

/**
 * Edit PTO component
 */
@Component({
    selector: 'create-pto-desc-modal',
    templateUrl: './create-pto-desc.component.html'
})

export class CreatePTODescComponent extends LanguageHandlerService implements OnInit {

    /**
    * Edit PTO description modal
    */
    @ViewChild('createPTODescModal') modal: ModalDirective;

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
     * Value of the PTO description form group object
     */
    addPTODescForm: FormGroup;
    /**
     * Value of the PTO description model
     */
    ptoDesc: PTODescriptionModel[] = [];

    /**
     * Value of the PTO information model
     */
    createNewPTO: PTOModel = { Id: 0, ImageURL: "", Remark: "", IsActive: true, PTODescription: this.ptoDesc, PassActivePTOs: [] };
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
        private ptoService: PTOServiceProvider,
        private _config_service: ConfigurationServiceProvider
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
        this.addPTODescForm = this.formBuilder.group({
            id: [0],
            ptoInformationId: [0],
            ptoName: ['', Validators.required],
            description: ['', Validators.required],
            selectedLanguage: ['', Validators.required],
            isActive: [true]
        }, );
    }
   
    /**
     * Convenience getter for easy access to form fields
     * @example
     * f()
     * @returns {void}
     */
    get f() { return this.addPTODescForm.controls; }
 
    /**
     * To open modal with auto fill value
     */
    show(id: number): void {
        this.ngOnInit();
        if (id <= 0)
            return this._custom_message_handler.errorMessage(this.lang("InvalidPTOInformation"));
        this.active = true;
        this.modal.show();
        this, this.createNewPTO.Id = id;
        (<FormControl>this.f['ptoInformationId']).setValue(id);
        this.getAvailableLanguages(id);
        //Object.assign({}, this.addPTODescForm.value);
    }
  
    /**
    * To save new PTO information
    * @example
    * save()
    * @param {object} ptoDescription PTO description
    * @returns {void}
    */
    save(): void {
        this.createNewPTO.PTODescription = [];
        this.submitted = true;
        // stop here if form is invalid
        if (this.addPTODescForm.invalid)
            return;
        this.createNewPTO.ImageURL = "";
        this.createNewPTO.Remark = "";
        this.createNewPTO.PTODescription.push(this.addPTODescForm.value);
        this.ptoService.UpdatePTO(this.createNewPTO)
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
    * To get language content based on selected language from local storage
    * @example
    * getActiveLanguagesFromCache
    * @returns {object} language contents
    */
    getAvailableLanguages(id: number) {
        this._languages.languages = [];
        this.ptoService.GetAvailableLanguages(id)
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
