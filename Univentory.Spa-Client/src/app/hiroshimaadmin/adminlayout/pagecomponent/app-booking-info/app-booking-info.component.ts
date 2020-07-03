import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { first } from 'rxjs/operators';

import { UserService, ConfigurationServiceProvider } from 'src/app/_services/componentservice';
import { LanguageHandlerService } from 'src/app/shared/handler/language.service';
import { ApiServicesHandlerService } from 'src/app/shared/handler/app.constant';
import { CreateAdminComponent } from 'src/app/hiroshimaadmin/adminlayout/pagecomponent/super-admin/create-admin/create-admin.component';
import * as moment from 'moment';
import { SearchParams } from 'src/app/shared/models';

/**
 * Booking information component
 */
@Component({ templateUrl: 'app-booking-info.component.html' })

export class AppBookingInfoComponent extends LanguageHandlerService implements OnInit {
    /**
     * Value of the Booking information model
     */
    bookingInformation: any = [];

    /**
    Value of the active pass list from API along with paginated information
    */
    paginatedBookingInfo = {
        items: this.bookingInformation,
        TotalCount: 0,
        TotalPages: 0,
        HasPreviousPage: false,
        HasNextPage: false
    }
    /**
     * Value of the minimum date to be shown in for date picker
     */
    minDate: string;
    /**
     * Value of the maximum date to be shown in for date picker
     */
    maxDate: string;
    /**
     * Value of the today's date while searching
     */
    startDate: Date;

    /**
     * Value of the end date while searching
     */
    endDate: Date;

    /**
     Value of SearchParams model for pagination 
    */    
    searchParams: SearchParams = {
        PageIndex: 1, PageSize: 10, Lang: 0, StartDateAndTime: "", EndDateAndTime: ""
    };

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
        // moment().format("DD-MMM-YYYY")
        this.startDate = new Date();
        const langInfo = JSON.parse(localStorage.getItem(ApiServicesHandlerService._cache_key_value.activeLanguageInfo))
        if (langInfo && langInfo.currentLanguage)
            this.searchParams.Lang = langInfo.currentLanguage.id;
        this.getBookingInfo();
    }

    /**
     * To search booking based on date
     * @example
     * getBookingInfo()
     * @returns {List} booking information
     */
    getBookingInfo() {
        this.paginatedBookingInfo.items = [];
        this.searchParams.StartDateAndTime = moment(this.startDate).format("MM/DD/YYYY");
        if (this.endDate) {
            if (moment(this.startDate, 'day').isSameOrBefore(moment(this.endDate), 'day'))
                this.searchParams.EndDateAndTime = moment(this.endDate).format("MM/DD/YYYY");
            else
                return this._custom_message_handler.errorMessage(this.lang("AskForValidDate"));
        }
        this.configService.GetBookingInfo(this.searchParams)
            .pipe(first())
            .subscribe(response => {
                if (!response || response.items.length == 0)
                    return this.isAvaileble = false;

                //Convert date
                response.items.forEach(element => {
                    element.bookingDate = moment(element.bookingDate).format("MM/DD/YYYY")
                });
                this.isAvaileble = true;
                this.paginatedBookingInfo = {
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
        if (!this.paginatedBookingInfo.HasPreviousPage)
            return;
        this.searchParams.PageIndex = this.searchParams.PageIndex - 1;
        this.getBookingInfo();
    }

    /**
* To get next result using pagination
* @example
* next()
*/
    next() {
        if (!this.paginatedBookingInfo.HasNextPage)
            return;
        this.searchParams.PageIndex = this.searchParams.PageIndex + 1;
        this.getBookingInfo();
    }

}