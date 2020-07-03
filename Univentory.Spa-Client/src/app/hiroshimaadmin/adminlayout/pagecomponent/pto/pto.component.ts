import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from 'src/app/_models';
import { UserService } from 'src/app/_services/componentservice';
import { LanguageHandlerService } from 'src/app/shared/handler/language.service';
import { ApiServicesHandlerService } from 'src/app/shared/handler/app.constant';
import { CreatePassComponent } from 'src/app/hiroshimaadmin/adminlayout/pagecomponent/pass/create-pass/create-pass.component';
import { CreatePTOComponent } from 'src/app/hiroshimaadmin/adminlayout/pagecomponent/pto/create-pto/create-pto.component';
import { PTOServiceProvider } from 'src/app/_services/componentservice/pto.service';
import { SearchParams, PTOModel } from 'src/app/shared/models';
import { CreatePTODescComponent } from 'src/app/hiroshimaadmin/adminlayout/pagecomponent/pto/create-pto-desc/create-pto-desc.component';
import { EditPTOComponent } from 'src/app/hiroshimaadmin/adminlayout/pagecomponent/pto/edit-pto/edit-pto.component';


/**
 * PTO component
 */
@Component({
    selector: 'create-pto-component',
    templateUrl: './pto.component.html'
})

export class PTOComponent extends LanguageHandlerService implements OnInit {

    /**
    * Create PTO modal
    */
    @ViewChild('createPTOModal') createPTOModal: CreatePTOComponent;

    /**
    * Create PTO description modal
    */
    @ViewChild('createPTODescModal') createPTODescModal: CreatePTODescComponent;

    /**
    * Edit pass modal
    */
    @ViewChild('editPTOModal') editPTOModal: EditPTOComponent;

    /**
    * Value of the PTO information model
    */
    activePTOs: PTOModel[] = [];
    /**
    Value of the active PTO list from API along with paginated information
    */
    paginatedPTOs = {
        items: this.activePTOs,
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
    constructor(injector: Injector, private ptoService: PTOServiceProvider) {
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
        this.refresh();
    }

    /**
     * Refresh active PTO information
     * @example
     * refresh()
     * @returns {void}
     */
    refresh() {
        this.getActivePTOs(true);
    }

    /**
     * To get active PTO information
     * @example
     * getActivePTOs()
     * @returns {List} active PTO information
     */
    getActivePTOs(status) {
        this.paginatedPTOs.items = [];
        this.ptoService.GetPTOs(this.searchParams, status)
            .pipe(first())
            .subscribe(response => {
                if (!response || !response.items || response.items.length == 0)
                    return this.isAvaileble = false
                this.isAvaileble = true;
                this.paginatedPTOs = {
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
        if (!this.paginatedPTOs.HasPreviousPage)
            return;
        this.searchParams.PageIndex = this.searchParams.PageIndex - 1;
        this.getActivePTOs(true);
    }

    /**
    * To get next result using pagination
    * @example
    * next()
    */
    next() {
        if (!this.paginatedPTOs.HasNextPage)
            return;
        this.searchParams.PageIndex = this.searchParams.PageIndex + 1;
        this.getActivePTOs(true);
    }


    /**
    * To create new PTO modal
    */
    createPTO(): void {
        this.createPTOModal.show();
    }


    /**
     * To create new PTO description modal
     */
    createPTODesc(id: number): void {
        this.createPTODescModal.show(id);
    }


    /**
     * To edit existing PTO modal
     */
    editPTO(item): void {
        this.editPTOModal.show(item);
    }

    /**
    * To delete PTO(soft delete) information 
    * @example
    * deletePass()
    * @param {number} id PTO info id
    * @param {number} index current selected PTO index
    * @returns {void} 
    */
    deletePTO(id: number, index: number): void {
        if (confirm(this.lang("DeletePTOInformationMessage"))) {
            this.ptoService.DeletePTO(id)
                .pipe(first())
                .subscribe(response => {
                    if (!response.success)
                        return this._custom_message_handler.errorMessage(this.lang(response.message));
                    this._custom_message_handler.successMessage(this.lang(response.message));
                    this.paginatedPTOs.items.splice(index, 1);
                    if (this.paginatedPTOs.items.length == 0 && !this.paginatedPTOs.HasPreviousPage)
                        this.isAvaileble = false;
                    else if(this.paginatedPTOs.items.length == 0 && this.paginatedPTOs.HasPreviousPage){
                        this.prev();
                    }
                    else if(this.paginatedPTOs.items.length > 0 && !this.paginatedPTOs.HasPreviousPage){
                        this.searchParams.PageIndex = 1;
                        this.getActivePTOs(true);
                    }
                },
                    error => {
                        this.isAvaileble = false;
                        this._custom_message_handler.errorMessage(this.lang(error));
                    });
        }
    }
}