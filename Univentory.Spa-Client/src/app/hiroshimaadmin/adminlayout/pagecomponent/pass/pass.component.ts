import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { first } from 'rxjs/operators';
import * as moment from 'moment';
import { User } from 'src/app/_models';
import { UserService } from 'src/app/_services/componentservice';
import { LanguageHandlerService } from 'src/app/shared/handler/language.service';
import { ApiServicesHandlerService } from 'src/app/shared/handler/app.constant';
import { CreatePassComponent } from 'src/app/hiroshimaadmin/adminlayout/pagecomponent/pass/create-pass/create-pass.component';
import { PassServiceProvider } from 'src/app/_services/componentservice/pass.service';
import { LanguageService } from 'src/app/shared/interfaces';
import { AuthenticationService } from 'src/app/_services';
import { SearchParams, PassModel } from 'src/app/shared/models';
import { EditPassComponent, AddPassDescComponent } from 'src/app/hiroshimaadmin/adminlayout/pagecomponent/pass';

/**
 * Pass component
 */
@Component({
    selector: 'create-pass-component',
    templateUrl: './pass.component.html'
})

export class PassComponent extends LanguageHandlerService implements OnInit {

    /**
   * Create pass modal
   */
    @ViewChild('createPassModal') createPassModal: CreatePassComponent;

    /**
   * Create pass description modal
   */
    @ViewChild('createPassDescModal') createPassDescModal: AddPassDescComponent;

    /**
   * Edit pass modal
   */
    @ViewChild('editPassModal') editPassModal: EditPassComponent;


    /**
     * Value of the pass information model
     */
    activePasses: PassModel[] = [];

    /**
    Value of the active pass list from API along with paginated information
    */
    paginatedPass = {
        items: this.activePasses,
        TotalCount: 0,
        TotalPages: 0,
        HasPreviousPage: false,
        HasNextPage: false
    }

    /**
    Value of SearchParams model for pagination 
     */
    searchParams: SearchParams = { PageIndex: 1, PageSize: 10, Lang: 0, StartDateAndTime: "" };

    /**
    Value of available pass status 
    */
    isAvaileble: boolean = true;

    /**
    *@ignore
    */
    constructor(injector: Injector, private passService: PassServiceProvider) {
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
        this.searchParams.StartDateAndTime = moment().format("MM/DD/YYYY");
        this.refresh();
    }

    /**
    * Refresh active pass information
    * @example
    * refresh()
    * @returns {void}
    */
    refresh() {
        this.getactivePasses();
    }

    /**
     * To get active pass information
     * @example
     * getactivePasses()
     * @returns {List} active pass information
     */
    getactivePasses() {
        this.passService.GetPasses(this.searchParams)
            .pipe(first())
            .subscribe(response => {
                if (!response || !response.items || response.items.length == 0)
                    return this.isAvaileble = false;

                //Convert Date
                response.items.forEach(element => {
                    element.passExpiredDate = moment(element.passExpiredDate).format("MM/DD/YYYY");
                });
                this.isAvaileble = true;
                this.paginatedPass = {
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
        if (!this.paginatedPass.HasPreviousPage)
            return;
        this.searchParams.PageIndex = this.searchParams.PageIndex - 1;
        this.getactivePasses();
    }

    /**
 * To get next result using pagination
 * @example
 * next()
 */
    next() {
        if (!this.paginatedPass.HasNextPage)
            return;
        this.searchParams.PageIndex = this.searchParams.PageIndex + 1;
        this.getactivePasses();
    }

    /**
    * To create new pass modal
    */
    createPass(): void {
        this.createPassModal.show();
    }

    /**
     * To create new pass description modal
     */
    createPassDesc(item): void {
        this.createPassDescModal.show(item);
    }

    /**
     * To edit existing pass modal
     */
    editPass(item): void {
        this.editPassModal.show(item);
    }


    /**
     * To delete pass(soft delete) information 
     * @example
     * deletePass()
     * @param {number} id pass info id
     * @param {number} index current selected pass index
     * @returns {void} 
     */
    deletePass(id: number, index: number): void {
        if (confirm(this.lang("DeletePassInformationMessage"))) {
            this.passService.DeletePass(id)
                .pipe(first())
                .subscribe(response => {
                    if (!response.success)
                        return this._custom_message_handler.errorMessage(this.lang(response.message));
                    this._custom_message_handler.successMessage(this.lang(response.message));
                    this.paginatedPass.items.splice(index, 1);
                    if (this.paginatedPass.items.length == 0 && !this.paginatedPass.HasPreviousPage)
                        this.isAvaileble = false;
                    else if (this.paginatedPass.items.length == 0 && this.paginatedPass.HasPreviousPage) {
                        this.prev();
                    }
                    else if(this.paginatedPass.items.length > 0 && !this.paginatedPass.HasPreviousPage){
                        this.searchParams.PageIndex = 1;
                        this.getactivePasses();
                    }
                },
                    error => {
                        this.isAvaileble = false;
                        this._custom_message_handler.errorMessage(this.lang(error));
                    });
        }
    }
}