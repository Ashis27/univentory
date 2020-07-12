import { Component, ViewChild, Injector, Output, EventEmitter, ElementRef, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import * as moment from 'moment';
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
import { SearchParams, PTOModel, PTODescriptionModel, PassDescriptionModel, PassActivePTOModel, PassModel } from 'src/app/shared/models';


/**
 * Edit pass information component
 */
@Component({
    selector: 'edit-pass-modal',
    templateUrl: './edit-pass.component.html'
})

export class EditPassComponent extends LanguageHandlerService implements OnInit {

    /**
    * Edit pass modal
    */
    @ViewChild('editPassModal') modal: ModalDirective;
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
     * Value of the pass form group object
     */
    addPassForm: FormGroup;

    /**
     * Value of the pass description model
     */
    passDesc: PassDescriptionModel[] = [];

    /**
     * Value of the pass having PTO model
     */
    passActivePTOs: PassActivePTOModel[] = [{ PTOInformationId: 0 }]

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
        PassActivePTOs: this.passActivePTOs
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
    Value of SearchParams model for pagination 
    */
    searchParams: SearchParams = { PageIndex: 1, PageSize: 100, Lang: 0 };

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
        const langInfo = JSON.parse(localStorage.getItem(ApiServicesHandlerService._cache_key_value.activeLanguageInfo))
        if (langInfo && langInfo.currentLanguage)
            this.searchParams.Lang = langInfo.currentLanguage.id;

        this.addPassForm = this.formBuilder.group({
            id: [0],
            passInformationId: [0],
            defaultCurrency: ['', Validators.required],
            passValidityInDays: [''],
            passValidityInHours: [''],
            passExpiredDurationInDays: [''],
            passExpiredDurationInHours: [''],
            passExpiredDate: ['', Validators.required],
            adultPrice: ['', Validators.required],
            childPrice: ['', Validators.required],
            remark: [''],
            passName: ['', Validators.required],
            passDesc: ['', Validators.required],
            passAreaDescription: ['', Validators.required],
            passAreaImageURL: [''],
            selectedLanguage: ['', Validators.required],
            isPerkAvailable: [false],
            perkDescription: [''],
            isActive: [true],
            selectedValidity: [],
            ptosAvailibilty: [[]]
        }, );

    }

    /**
 * Convenience getter for easy access to form fields
 * @example
 * f()
 * @returns {void}
 */
    get f() { return this.addPassForm.controls; }


    /**
     * To open modal with auto fill value
     */
    show(passInfo: any): void {
        this.minDate = new Date();
        this.createNewPass.Id = passInfo.id;
        if (!passInfo || passInfo.passDescription.length == 0)
            return this._custom_message_handler.errorMessage(this.lang("InvalidPassInformation"));
        if (!passInfo.passDescription || passInfo.passDescription.length == 0)
            return this._custom_message_handler.errorMessage(this.lang("InvalidPassDescription"));
        if (!passInfo.passActivePTOs || passInfo.passActivePTOs.length == 0)
            return this._custom_message_handler.errorMessage(this.lang("InvalidPTOInformation"));

        this.getActiveLanguagesFromCache();
        this.getActiveCurrenciesFromCache();
        this.getActivePTOs();
        this.ngOnInit();
        if (passInfo.passValidityInDays > 0)
            (<FormControl>this.f['selectedValidity']).setValue("days");
        else
            (<FormControl>this.f['selectedValidity']).setValue("hours");
        (<FormControl>this.f['defaultCurrency']).setValue(passInfo.defaultCurrency);
        (<FormControl>this.f['passValidityInDays']).setValue(passInfo.passValidityInDays > 0 ? passInfo.passValidityInDays : '');
        (<FormControl>this.f['passValidityInHours']).setValue(passInfo.passValidityInHours > 0 ? passInfo.passValidityInHours : '');
        // (<FormControl>this.f['passExpiredDurationInDays']).setValue(passInfo.passExpiredDurationInDays);
        // (<FormControl>this.f['passExpiredDurationInHours']).setValue(passInfo.passExpiredDurationInHours);
        (<FormControl>this.f['passExpiredDate']).setValue(passInfo.passExpiredDate);
        (<FormControl>this.f['adultPrice']).setValue(passInfo.adultPrice);
        (<FormControl>this.f['childPrice']).setValue(passInfo.childPrice);
        (<FormControl>this.f['remark']).setValue(passInfo.remark);
        (<FormControl>this.f['passInformationId']).setValue(passInfo.id);
        (<FormControl>this.f['passName']).setValue(passInfo.passDescription[0].passName);
        (<FormControl>this.f['passDesc']).setValue(passInfo.passDescription[0].passDesc);
        (<FormControl>this.f['id']).setValue(passInfo.passDescription[0].id);
        (<FormControl>this.f['passAreaDescription']).setValue(passInfo.passDescription[0].passAreaDescription);
        (<FormControl>this.f['passAreaImageURL']).setValue(passInfo.passDescription[0].passAreaImageURL);
        (<FormControl>this.f['selectedLanguage']).setValue(passInfo.passDescription[0].selectedLanguage);
        (<FormControl>this.f['isPerkAvailable']).setValue(passInfo.passDescription[0].isPerkAvailable);
        (<FormControl>this.f['isActive']).setValue(true);
        (<FormControl>this.f['perkDescription']).setValue(passInfo.passDescription[0].perkDescription);
        this.createNewPass.PassActivePTOs = passInfo.passActivePTOs;

        this.active = true;
        this.modal.show();
        // Object.assign({}, this.contactForm.value);
    }

    /**
   * To update pass information
   * @example
   * save()
   * @param {object} passInformation pass information
   * @returns {void}
   */
    save(): void {
        this.createNewPass.PassDescription = [];
        this.submitted = true;
        if (this.f.selectedValidity.value == 'days') {
            (<FormControl>this.f['passValidityInHours']).setValue('');
            if (this.f.passValidityInDays.value <= 0)
                return this._custom_message_handler.errorMessage(this.lang("ValueMustBeGretterThan0"));
        }
        else {
            (<FormControl>this.f['passValidityInDays']).setValue('');
            if (this.f.passValidityInHours.value <= 0)
                return this._custom_message_handler.errorMessage(this.lang("ValueMustBeGretterThan0"));
        }
        // stop here if form is invalid
        if (this.addPassForm.invalid)
            return;
        if (this.f.isPerkAvailable.value && !this.f.perkDescription.value)
            return;
        this.passActivePTOs = [];
        this.activePTOs.forEach(element => {
            if (element.isChecked)
                this.passActivePTOs.push({ PTOInformationId: element.id, PassInformationId: this.createNewPass.Id, IsActive: true });
        });
        if (this.passActivePTOs.length == 0)
            return this._custom_message_handler.errorMessage(this.lang("AssignAtleastOnePTO"));
        this.createNewPass.PassActivePTOs = this.passActivePTOs;
        this.createNewPass.ImageURL = "";
        this.createNewPass.DefaultCurrency = this.f.defaultCurrency.value;
        this.createNewPass.PassValidityInDays = this.f.passValidityInDays.value > 0 ? this.f.passValidityInDays.value : 0;;
        this.createNewPass.PassValidityInHours = this.f.passValidityInHours.value > 0 ? this.f.passValidityInHours.value : 0;
        // this.createNewPass.PassExpiredDurationInDays = this.f.passExpiredDurationInDays.value;
        // this.createNewPass.PassExpiredDurationInHours = this.f.passExpiredDurationInHours.value;
        this.createNewPass.PassExpiredDate = moment(this.f.passExpiredDate.value).format("MM/DD/YYYY");
        this.createNewPass.AdultPrice = this.f.adultPrice.value;
        this.createNewPass.ChildPrice = this.f.childPrice.value;
        this.createNewPass.Remark = this.f.remark.value;
        this.createNewPass.IsActive = true;
        this.createNewPass.PassDescription.push(this.addPassForm.value);
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
    * To get currencies from local storage
    * @example
    * getActiveCurrenciesFromCache
    * @returns {object} currencies
    */
    getActiveCurrenciesFromCache() {
        let result: any = JSON.parse(localStorage.getItem(ApiServicesHandlerService._cache_key_value.activeCurriencies));;
        if (result && result.length > 0)
            this.activeCurrencies = result;
        this.getActiveCurrencies(false);
    }

    /**
  * To get currencies
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
  * To get currencies
  * @example
  * getActiveCurrencies
  * @param {boolean} status True | False (Use loader or not)
  * @returns {object} currencies
  */
    getActiveCurrencies(status) {
        this.activeCurrencies = [];
        this._config_service.GetActiveCurriencies(this.searchParams)
            .subscribe(response => {
                if (response && response.items.length > 0) {
                    this.activeCurrencies = response.items;
                    localStorage.setItem(ApiServicesHandlerService._cache_key_value.activeCurriencies, JSON.stringify(this.activeCurrencies));
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

    /**
     * To get active PTOs
     * @example
     * getActivePTOs()
     * @param {SearchParams} searchParams pagination information
     * @returns {List} active PTOs
     */
    getActivePTOs() {
        this.activePTOs = [];
        this.ptoService.GetPTOs(this.searchParams, false)
            .pipe(first())
            .subscribe(response => {
                if (!response.items || response.items.length == 0)
                    return this.isAvaileble = false;
                const selectedPTOs: any = this.createNewPass.PassActivePTOs;
                selectedPTOs.forEach(element => {
                    response.items.forEach(item => {
                        if (element.ptoInformationId === item.ptoDescription[0].ptoInformationId)
                            item["isChecked"] = true;
                    });
                });
                this.isAvaileble = true;
                this.activePTOs = response.items;
            },
                error => {
                    this.isAvaileble = false;
                    this._custom_message_handler.errorMessage(this.lang(error));
                });
    }

}
