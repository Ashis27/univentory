import { Router } from '@angular/router';
import { Component, OnInit, NgZone, ChangeDetectionStrategy, Injector } from '@angular/core';
import { LanguageHandlerService, ApiServicesHandlerService } from '../../../shared/handler';
import { SideMenu } from '../../../shared/models/SideMenu';
import { SearchParams } from '../../../shared/models';
import { ConfigurationServiceProvider } from '../../../_services/componentservice';
import { UserService } from 'src/app/_services/componentservice/user.service';
import { Role } from '../../../shared/enum/role';
import { LanguageService } from '../../../shared/interfaces';


/**
 * Jquery initialization
 */
declare const $: any;

/**
 * Side navbar component
 */
@Component({
    selector: 'app-sidenavbar-cmp',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: 'sidenav.component.html',
    styleUrls: ['./sidenav.component.css']
})

export class SidebarComponent extends LanguageHandlerService implements OnInit {

    /**
     * Current user details
     */
    userDetails: any;
    /**
    Value of SearchParams model for pagination 
    */
    searchParams: SearchParams = { PageIndex: 1, PageSize: 20, Lang: 0 };

    /**
     * Side menu list
     */
    public menuItems: Array<SideMenu> = [];

    /**
     * Value of the current toogle value
     */
    toogleCount: number = 0;
    /**
     * Current user information
     */
    currentUserInfo: any;
    /**
     * NEC admin side menu information
     */
    necAdminMenu: Array<SideMenu> = [
        { Id: 1, SortName: "User", Name: "User", Icon: "assets/imgs/menu/group.svg", RedirectURL: "/dashboard/super-admin-user", IsDefault: true },
        // { SortName: "Language", Name: "Language", Icon: "", RedirectURL: "/language", IsDefault: false },
        // { SortName: "Currency", Name: "Currency", Icon: "", RedirectURL: "/currency", IsDefault: false },
    ];
    /**
    * Admin side menu information
    */
    adminMenu: Array<SideMenu> = [
        { Id: 1, SortName: "Pass", Name: "Pass", Icon: "assets/imgs/menu/ticket.svg", RedirectURL: "/dashboard/active-pass", IsDefault: true },
        { Id: 2, SortName: "PTO", Name: "PTO", Icon: "assets/imgs/menu/train.svg", RedirectURL: "/dashboard/active-pto", IsDefault: false },
        { Id: 3, SortName: "Language", Name: "Language", Icon: "assets/imgs/menu/language.svg", RedirectURL: "/dashboard/language", IsDefault: false },
        { Id: 4, SortName: "Currency", Name: "Currency", Icon: "assets/imgs/menu/coins.svg", RedirectURL: "/dashboard/currency", IsDefault: false },
        { Id: 5, SortName: "Booking", Name: "Booking", Icon: "assets/imgs/menu/event.svg", RedirectURL: "/dashboard/booking-info", IsDefault: false },
        { Id: 6, SortName: "Feedback", Name: "Feedback", Icon: "assets/imgs/menu/document.svg", RedirectURL: "/dashboard/feedback-info", IsDefault: false },
        { Id: 7, SortName: "QRConfig", Name: "QRConfig", Icon: "assets/imgs/menu/gear.svg", RedirectURL: "/dashboard/configuration-info", IsDefault: false },
        // { SortName: "Transation", Name: "Transation Info", Icon: "", RedirectURL: "", IsDefault: false }
    ];
    /**
    * Super admin side menu information
    */
    superAdminMenu: Array<SideMenu> = [
        { Id: 1, SortName: "Pass", Name: "Pass", Icon: "assets/imgs/menu/ticket.svg", RedirectURL: "/dashboard/active-pass", IsDefault: true },
        { Id: 2, SortName: "PTO", Name: "PTO", Icon: "assets/imgs/menu/train.svg", RedirectURL: "/dashboard/active-pto", IsDefault: false },
        { Id: 3, SortName: "Language", Name: "Language", Icon: "assets/imgs/menu/language.svg", RedirectURL: "/dashboard/language", IsDefault: false },
        { Id: 4, SortName: "Currency", Name: "Currency", Icon: "assets/imgs/menu/coins.svg", RedirectURL: "/dashboard/currency", IsDefault: false },
        { Id: 5, SortName: "Booking", Name: "Booking", Icon: "assets/imgs/menu/event.svg", RedirectURL: "/dashboard/booking-info", IsDefault: false },
        { Id: 7, SortName: "Feedback", Name: "Feedback", Icon: "assets/imgs/menu/document.svg", RedirectURL: "/dashboard/feedback-info", IsDefault: false },
        { Id: 7, SortName: "QRConfig", Name: "QRConfig", Icon: "assets/imgs/menu/gear.svg", RedirectURL: "/dashboard/configuration-info", IsDefault: false },
        // { SortName: "Transation", Name: "Transation Info", Icon: "", RedirectURL: "", IsDefault: false },
        { Id: 6, SortName: "User", Name: "User", Icon: "assets/imgs/menu/group.svg", RedirectURL: "/dashboard/admin-user", IsDefault: false }

    ];

    /**
    Value of the LanguageService which contain selected language with all static label contents and all active languages
    */
    public _languages: LanguageService = {
        languages: [],
        currentLanguage: Object.assign({}),
        currentLangContents: null
    };

    /**
     * @ignore
     */
    constructor(
        zone: NgZone,
        Injector: Injector,
        public router: Router,
        private _config_service: ConfigurationServiceProvider,
        private _userService: UserService
    ) {
        super(Injector);


    }

    /**
     * Toogle side navbar modal
     * @example
     * sidebarCollapse()
     * @returns {void}
     */
    sidebarCollapse() {
        if (this.toogleCount % 2 === 0)
            $('#sidebar').addClass('active');
        else
            $('#sidebar').removeClass('active');
        this.toogleCount++;
    }

    /**
    * Initial entry point
    * @example
     * ngOnInit()
    * @returns {void}
    */
    ngOnInit() {
        this.currentUserInfo = JSON.parse(localStorage.getItem(ApiServicesHandlerService._cache_key_value.loggedInUser));
        const tokenPayload: any = this._authenticationService.decodeToken();
        this.getMenuByRole(tokenPayload.role);
        this.getActiveLanguagesFromCache();
    }

    /**
     * To get active menu list based ob role
     * @example
     * getMenuByRole(NECAdmin)
     * @param {string} role role name
     * @returns {List} menu list; 
     */
    getMenuByRole(role) {
        switch (role) {
            case Role.NECAdmin:
                this.menuItems = this.necAdminMenu;
                break;
            case Role.SuperAdmin:
                this.menuItems = this.superAdminMenu;
                break;
            case Role.Admin:
                this.menuItems = this.adminMenu;
                break;
            default:
                this.menuItems = [];
                break;
        }
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
        this._config_service.GetActiveLanguages(this.searchParams, status)
            .subscribe(response => {
                if (response && response.items.length > 0) {
                    this._languages.languages = response.items;
                    localStorage.setItem(ApiServicesHandlerService._cache_key_value.activeLanguageInfo, JSON.stringify(this._languages));
                }
                else
                    this._custom_message_handler.errorMessage(this.lang("FailedToRetrieveLang"));
            },
                error => {
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
        this._languages.currentLanguage = lang;
        this._languages.currentLangContents = null;
        await localStorage.setItem(ApiServicesHandlerService._cache_key_value.activeLanguageInfo, JSON.stringify(this._languages));
        window.location.href = "/";
        // location.reload(true);
    }

    /**
     * To redirect page based on selected menu item URL
     * @example
     * redirect("/dashboard")
     * @param {string} item menu item URL
     * @returns {void}
     */
    redirect(item) {
        this.menuItems.forEach(element => {
            element.IsDefault = false;
            if (element.Name == item.Name && element.Id === item.Id)
                element.IsDefault = true;
        })
        this.router.navigate([item.RedirectURL]);
    }

    /**
     * Logout 
     * @example
     * logout()
     * @returns {boolean}
     */
    logout() {
        this._authenticationService.logout();
        window.location.href = "/";
        // this._userService.Logout()
        //     .subscribe(response => {
        //         if (!response || !response.success)
        //             return this._custom_message_handler.errorMessage(this.lang("DefaultErrorMessage"));
        //         this._authenticationService.logout();
        //         window.location.href = "/";
        //     },
        //         error => {
        //             this._custom_message_handler.errorMessage(this.lang(error));
        //         });
    }
}
