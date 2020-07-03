import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';



import { Injector } from '@angular/core';

import { ApiServicesHandlerService } from '../../../shared/handler/app.constant';
import { LanguageService } from '../../../shared/interfaces';
import { LanguageHandlerService } from '../../../shared/handler';
import { AuthenticationService } from '../../../_services';
import { SearchParams } from 'src/app/shared/models';
import { ConfigurationServiceProvider } from 'src/app/_services/componentservice';

/**
 * Login component
 */
@Component({ templateUrl: 'login.component.html' })
export class LoginComponent extends LanguageHandlerService implements OnInit {

    /**
     * Login form group object
     */
    loginForm: FormGroup;
    /**
     * Value of the loading status
     */
    loading = false;
    /**
     * Value of the submit form status
     */
    submitted = false;
    /**
     * Value of the return url from where user got logout
     */
    returnUrl: string;

    /**
     * Value of the error message
     */
    error = '';
    /**
    Value of SearchParams model for pagination 
    */
    searchParams: SearchParams = { PageIndex: 1, PageSize: 20, Lang: 0 };
    /**
    Value of the LanguageService which contain selected language with all static label contents and all active languages
    */
    _language_service: LanguageService = {
        languages: [],
        currentLanguage: Object.assign({}),
        currentLangContents: []
    };
    /**
     * @ignore
     */
    constructor(
        injector: Injector,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private _config_service: ConfigurationServiceProvider
    ) {
        super(injector);
        // redirect to home if already logged in

        // if (this.authenticationService.isAuthenticated()) { 
        //     this.router.navigate(['/']);
        // }
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }

    /**
    * Initial entry point
    * @example
    * ngOnInit()
    * @returns {void}
    */
    ngOnInit() {
        this.getActiveLanguagesFromCache();
        this.loginForm = this.formBuilder.group({
            userName: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
        // reset login status
        this.authenticationService.logout();
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    /**
    * Convenience getter for easy access to form fields
    * @example
    * f()
    * @returns {void}
    */
    get f() { return this.loginForm.controls; }

    /**
   * To get all active languages from cache and then get updated from API call and store in cache
   * @example
   *  getActiveLanguagesFromCache()
   * @returns {LanguageService} 
   */
    getActiveLanguagesFromCache() {
        let result: any = JSON.parse(localStorage.getItem(ApiServicesHandlerService._cache_key_value.activeLanguageInfo));
        if (result)
            this._language_service = {
                currentLanguage: result.currentLanguage,
                currentLangContents: result.currentLangContents,
                languages: result.languages
            };
        else
            this.getActiveLanguages(false);
    }

    /**
    * To get active languages
    * @example
    * getActiveLanguages(false)
    * @param {boolean} status True | False (Use loader or not)
    * @returns {List} active language information
    */
    getActiveLanguages(status) {
        this._config_service.GetActiveLanguages(this.searchParams, status)
            .pipe(first())
            .subscribe(response => {
                if (!response || response.items.length == 0)
                    return this._custom_message_handler.errorMessage(this.lang("NoLanguageAvailable"));
                this._language_service.languages = response.items;
            },
                error => {
                    this._custom_message_handler.errorMessage(this.lang(error));
                });

    }
    /**
     * To submit user login form for authentication
     * @example
     * onSubmit()
     * @param {LoginForm} login form information
     * @returns {boolean} True | False
     */
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid)
            return;

        this.loading = true;
        this.authenticationService.Login(this.loginForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    if (!data.success) {
                        this.loading = false;
                        return this._custom_message_handler.errorMessage(this.lang(data.message));
                    }
                    this.router.navigate([this.returnUrl]);
                    localStorage.setItem(ApiServicesHandlerService._cache_key_value.loggedInUser, JSON.stringify(this.loginForm.value.userName));
                },
                error => {
                    this.loading = false;
                    this._custom_message_handler.errorMessage(this.lang(error));
                });
    }

    /**
 * To get language content based on selected language id
 * @example
 * onChangeLanguage(1)
 * @param {number} lang language id
 * @returns {void} reload page once language changed
 */
    async onChangeLanguage(lang) {
        this._language_service.currentLanguage = lang;
        this._language_service.currentLangContents = null;
        await localStorage.setItem(ApiServicesHandlerService._cache_key_value.activeLanguageInfo, JSON.stringify(this._language_service));
        window.location.href = "/";
        // location.reload(true);
    }
}
