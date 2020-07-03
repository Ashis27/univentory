import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User } from './_models';
import { LanguageHandlerService } from './shared/handler/language.service';
import { LanguageService } from './shared/interfaces';
import { ApiServicesHandlerService } from './shared/handler/app.constant';
import { CustomValidationHandlerService } from './shared/handler/customvalidation.service';
import { ConfigurationServiceProvider } from './_services/componentservice';
import { SearchParams } from './shared/models';


/**
 * App component
 */
@Component({
    selector: 'app',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    /**
    Value of the LanguageService which contain selected language with all static label contents and all active languages
    */
    _lang_services: LanguageService = {
        languages: [],
        currentLanguage: Object.assign({}),
        currentLangContents: null
    };

    /**
    Value of SearchParams model for pagination 
    */
    searchParams: SearchParams = { PageIndex: 1, PageSize: 20, Lang: 0 };
    /**
     * Language information
     */
    langInfo: any;
    /**
     * @ignore
     */
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private languageService: LanguageHandlerService,
        private _custom_message_handler: CustomValidationHandlerService,
        private _config_service: ConfigurationServiceProvider
    ) {
        this.langInfo = JSON.parse(localStorage.getItem(ApiServicesHandlerService._cache_key_value.activeLanguageInfo));
        this.getActiveLanguages(true);
    }


    /**
    * To get active languages
    * @example
    * getActiveLanguages(status)
    * @param status True | False (Use loader or not)
    * @returns list of active language
    */
    getActiveLanguages(status) {
        this._config_service.GetActiveLanguages(this.searchParams, status)
            .subscribe(response => {
                if (response && response.items.length > 0) {
                    let defaultLang: any;
                    if (this.langInfo && this.langInfo.currentLanguage && this.langInfo.currentLanguage.displayName)
                        defaultLang = this.langInfo.currentLanguage;
                    else
                        response.items.forEach(element => {
                            if (element.isDefault)
                                defaultLang = element
                        });
                    this._lang_services.currentLanguage = defaultLang;
                    this._lang_services.languages = response.items;
                    if (!defaultLang)
                        return this._custom_message_handler.errorMessage("Something went wrong. Please try again");
                    this.getActiveLangContents(defaultLang.displayName, true);
                }
                else
                    this._custom_message_handler.errorMessage("Something went wrong. Please try again");
            },
                error => {
                    //this._custom_message_handler.errorMessage(this.lang(error));
                });
    }

  /**
  * To get selected language contents
  * @example
  * getActiveLangContents()
  * @param {string} lang selected lang name
  * @param {boolean} status True | False (Use loader or not)
  * @returns active language contents
  */
    getActiveLangContents(lang, status) {
        this._config_service.GetActiveLanguageContents(lang)
            .subscribe(response => {
                if (response && response.culture.lang == lang && response.languages) {
                    this._lang_services.currentLangContents = response.languages;
                    localStorage.setItem(ApiServicesHandlerService._cache_key_value.activeLanguageInfo, JSON.stringify(this._lang_services));
                    this.router.navigateByUrl("/dashboard");
                }
                else
                    this._custom_message_handler.errorMessage(this._lang_services.currentLanguage.name + " language contents haven't configured.");
            },
                error => {
                   // this._custom_message_handler.errorMessage(this.lang(error));
                });
    }
}