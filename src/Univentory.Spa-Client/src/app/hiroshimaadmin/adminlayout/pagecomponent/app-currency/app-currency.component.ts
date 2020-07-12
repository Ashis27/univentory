import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from 'src/app/_models';
import { UserService, ConfigurationServiceProvider } from 'src/app/_services/componentservice';
import { LanguageHandlerService } from 'src/app/shared/handler/language.service';
import { ApiServicesHandlerService } from 'src/app/shared/handler/app.constant';
import { CreateAdminComponent } from 'src/app/hiroshimaadmin/adminlayout/pagecomponent/super-admin/create-admin/create-admin.component';
import { CurrencyModule } from 'src/app/shared/models/CurrencyModule';
import { SearchParams } from 'src/app/shared/models';


/**
 * Currency information component
 */
@Component({ templateUrl: 'app-currency.component.html' })

export class AppCurrencyComponent extends LanguageHandlerService implements OnInit {

     /**
     * Value of the Currency information model
     */
    activeCurrencies: CurrencyModule[] = [];

     /**
     Value of the active pass list from API along with paginated information
    */   
    paginatedCurrencies = {
        items: this.activeCurrencies,
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
     */
    ngOnInit(): void {
        this.getActiveCurrencies();
    }

    /**
     * To get active currencies
     * @example
     * getActiveCurrencies()
     * @returns {List} active currency information
     */
    getActiveCurrencies() {
        this.paginatedCurrencies.items = [];
        this.configService.GetActiveCurriencies(this.searchParams)
            .pipe(first())
            .subscribe(response => {
                if (!response || response.items.length == 0)
                    return this.isAvaileble = false;
                this.isAvaileble = true;
                this.paginatedCurrencies = {
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
        if (!this.paginatedCurrencies.HasPreviousPage)
            return;
        this.searchParams.PageIndex = this.searchParams.PageIndex - 1;
        this.getActiveCurrencies();
    }

/**
* To get next result using pagination
* @example
* next()
*/
    next() {
        if (!this.paginatedCurrencies.HasNextPage)
            return;
        this.searchParams.PageIndex = this.searchParams.PageIndex + 1;
        this.getActiveCurrencies();
    }
}