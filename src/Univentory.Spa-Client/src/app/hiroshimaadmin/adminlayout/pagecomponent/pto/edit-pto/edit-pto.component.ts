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
import { SearchParams, PTOModel, PTODescriptionModel } from 'src/app/shared/models';

/**
 * Edit PTO component
 */
@Component({
    selector: 'edit-pto-modal',
    templateUrl: './edit-pto.component.html'
})

export class EditPTOComponent extends LanguageHandlerService implements OnInit {

    /**
     * Edit PTO modal
     */
    @ViewChild('editPTOModal') modal: ModalDirective;
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
     * Value of the PTO form group object
     */
    addPTOForm: FormGroup;
    /**
     * Value of the PTO description model
     */
    ptoDesc: PTODescriptionModel[] = [];

    /**
     * Value of the PTO information model
     */
    createNewPTO: PTOModel = { ImageURL: "", Remark: "", IsActive: true, PTODescription: this.ptoDesc, PassActivePTOs: [] };

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
    Value of SearchParams model for pagination 
    */
    searchParams: SearchParams = { PageIndex: 1, PageSize: 10, Lang: 0 };

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
        this.addPTOForm = this.formBuilder.group({
            id: [0],
            ptoInformationId: [0],
            ptoName: ['', Validators.required],
            description: ['', Validators.required],
            selectedLanguage: ['', Validators.required],
            isActive: [true],
        }, );
    }

    /**
     * Convenience getter for easy access to form fields
     * @example
     * f()
     * @returns {void}
     */
    get f() { return this.addPTOForm.controls; }

    /**
     * To open modal with auto fill value
     * @example
     * show()
     * @param {PTOInformation} userData pto information
     * @returns {void}
     */
    show(userData: any): void {
        this.createNewPTO.Id = userData.id;
        if (!userData || userData.ptoDescription.length == 0)
            return this._custom_message_handler.errorMessage(this.lang("InValidPtoInformation"));
        if (!userData.ptoDescription || userData.ptoDescription.length == 0)
            return this._custom_message_handler.errorMessage(this.lang("InvalidPtoDescription"));
        this.getActiveLanguagesFromCache();
        (<FormControl>this.f['id']).setValue(userData.ptoDescription[0].id);
        (<FormControl>this.f['ptoInformationId']).setValue(userData.id);
        (<FormControl>this.f['ptoName']).setValue(userData.ptoDescription[0].ptoName);
        (<FormControl>this.f['description']).setValue(userData.ptoDescription[0].description);
        (<FormControl>this.f['selectedLanguage']).setValue(userData.ptoDescription[0].selectedLanguage);
        (<FormControl>this.f['isActive']).setValue(userData.ptoDescription[0].isActive);
        this.active = true;
        this.modal.show();
    }

    /**
    * To save new PTO information
    * @example
    * save()
    * @param {object} ptoInformation PTO information
    * @returns {void}
    */
    save(): void {
        this.createNewPTO.PTODescription = [];
        this.submitted = true;
        // stop here if form is invalid
        if (this.addPTOForm.invalid)
            return;
        this.createNewPTO.ImageURL = "";
        this.createNewPTO.Remark = "";
        this.createNewPTO.PTODescription.push(this.addPTOForm.value);
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
    getActiveLanguagesFromCache() {
        let result: any = JSON.parse(localStorage.getItem(ApiServicesHandlerService._cache_key_value.activeLanguageInfo));;
        this._languages = {
            currentLanguage: result.currentLanguage,
            currentLangContents: result.currentLangContents,
            languages: result.languages
        };
        this.getActiveLanguages(false);
    }

    /**
   * To get languages
   * @example
   * getActiveLanguages
   * @param {boolean} status True | False (Use loader or not)
   * @returns {List} languages
   */
    getActiveLanguages(status) {
        this._languages.languages = [];
        this._config_service.GetActiveLanguages(this.searchParams, status)
            .subscribe(response => {
                if (response && response.items.length > 0) {
                    this._languages.languages = response.items;
                    localStorage.setItem(ApiServicesHandlerService._cache_key_value.activeLanguageInfo, JSON.stringify(this._languages));
                }
                else
                    this._custom_message_handler.errorMessage(this.lang('FailedToRetrieve'));
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
