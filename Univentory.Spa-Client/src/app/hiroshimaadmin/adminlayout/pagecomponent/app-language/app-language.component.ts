import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from 'src/app/_models';
import { UserService, ConfigurationServiceProvider } from 'src/app/_services/componentservice';
import { LanguageHandlerService } from 'src/app/shared/handler/language.service';
import { ApiServicesHandlerService } from 'src/app/shared/handler/app.constant';
import { CreateAdminComponent } from 'src/app/hiroshimaadmin/adminlayout/pagecomponent/super-admin/create-admin/create-admin.component';
import { SearchParams } from 'src/app/shared/models';
import { ILanguageInfo } from 'src/app/shared/interfaces';

/**
 * Language information component
 */
@Component({ templateUrl: 'app-language.component.html' })

export class AppLanguageComponent extends LanguageHandlerService implements OnInit {

     /**
     * Value of the language information model
     */
    activeLanguages: ILanguageInfo[] = [];
    /**
     Value of the active pass list from API along with paginated information
    */  
    paginatedLanguages = {
        items: this.activeLanguages,
        TotalCount: 0,
        TotalPages: 0,
        HasPreviousPage: false,
        HasNextPage: false
    }
    
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
    constructor(injector: Injector, private configService: ConfigurationServiceProvider) {
        super(injector);
    }

    /**
     * Initial entry point
     * @example
     * ngOnInit()
     * @returns {void}
     */
    ngOnInit(): void {
        this.getActiveLanguages(true);
    }

    /**
     * To get active languages
     * @example
     * getActiveLanguages(false)
     * @param {boolean} status True | False (Use loader or not)
     * @returns {List} active language information
     */
    getActiveLanguages(status) {
        this.paginatedLanguages.items=[];
        this.configService.GetActiveLanguages(this.searchParams,status)
            .pipe(first())
            .subscribe(response => {
                if (!response || response.items.length == 0)
                    return this.isAvaileble = false;
                this.isAvaileble = true;
                this.paginatedLanguages = {
                    items: response.items,
                    TotalCount: response.totalCount,
                    TotalPages: response.totalPages,
                    HasPreviousPage: response.hasPreviousPage,
                    HasNextPage: response.hasNextPage
                };
            },
                error => {
                    this.isAvaileble = false;
                    this._custom_message_handler.errorMessage(this.lang(error));
                });

    }
/**
 * To get previous result using pagination
 * @example
 * prev()
 */
    prev() {
        if (!this.paginatedLanguages.HasPreviousPage)
            return;
        this.searchParams.PageIndex = this.searchParams.PageIndex - 1;
        this.getActiveLanguages(true);
    }

/**
 * To get next result using pagination
 * @example
 * next()
 */
    next() {
        if (!this.paginatedLanguages.HasNextPage)
            return;
        this.searchParams.PageIndex = this.searchParams.PageIndex + 1;
        this.getActiveLanguages(true);
    }
}