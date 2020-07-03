import { Injectable } from '@angular/core';
import { HttpServiceProvider } from 'src/app/_services/http.services';
import { AppConfigurationServiceProvider } from 'src/app/_services/app.configuration.service';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { AdminUser } from 'src/app/shared/models/AdminUser';
import { SearchParams, PTOModel } from 'src/app/shared/models';

/*
  Generated class for the admin.service provider.
*/
@Injectable({ providedIn: 'root' })
export class PTOServiceProvider {

    /**
     * @ignore
     */
    constructor(private _http: HttpServiceProvider, private _app_config_service: AppConfigurationServiceProvider) {

    }

    /**
    * To create a new PTO
    * @example  
    * CreatePass(ptoInfo)
    * @param {PTOModel} ptoInfo PTO information
    * @returns {boolean}
    */
    CreatePTO = (ptoInfo: PTOModel): Observable<any> => {
        return this._http.post(this._app_config_service.getApiService("createPTO").toString() + "/" + ptoInfo, ptoInfo)
            .pipe(tap(response => {
                return response;
            }));
    }
    /**
    * To update existing PTO by PTO id
    * @example  
    * UpdatePass(ptoInfo)
    * @param {PTOModel} ptoInfo PTO information
    * @returns {boolean}
    */
    UpdatePTO = (ptoInfo: PTOModel): Observable<any> => {
        return this._http.put(this._app_config_service.getApiService("updatePTO").toString() + "/" + ptoInfo, ptoInfo)
            .pipe(tap(response => {
                return response;
            }));
    }

    /**
    * To get all active PTOs
    * @example
    * GetPTOs(searchParams,false)
    * @param {SearchParams} searchParams pagination details
    * @param {boolean} status True | False
    * @returns {List} PTO information
    */
    GetPTOs = (searchParams: SearchParams, status: boolean): Observable<any> => {
        return this._http.post(this._app_config_service.getApiService("getPTOs").toString() + "/" + searchParams, searchParams, status)
            .pipe(tap(response => {
                return response;
            }));
    }


    /**
    * To get selected PTO information by indivisual PTO id
    * @example
    * GetPass(en,1)
    * @param {number} lang language id
    * @param {number} id PTO id
    * @returns {PTOModel} PTO information
    */
    GetPTO = (lang: number, id: number): Observable<any> => {
        return this._http.get(this._app_config_service.getApiService("getPTO").toString() + "/" + id + "/Onlanguage/" + lang)
            .pipe(tap(response => {
                return response;
            }));
    }

    /**
    * To delete selected PTO by PTO id
    * @example  
    * DeletePTO(ptoInfo)
    * @param {number} id PTO information
    * @returns {boolean}
    */
    DeletePTO = (id: number): Observable<any> => {
        return this._http.delete(this._app_config_service.getApiService("deletePTO").toString() + "/" + id)
            .pipe(tap(response => {
                return response;
            }));
    }

    /**
    * To get all available languages which is not yet added in PTO description
    * @example  
    * GetAvailableLanguages(1)
    * @param {number} id PTO information id
    * @returns {List} language information
    */ 
    GetAvailableLanguages = (id: number): Observable<any> => {
        return this._http.get(this._app_config_service.getApiService("getPTOLanguages").toString() + "/" + id + "/AvailableLanguage")
            .pipe(tap(response => {
                return response;
            }));
    }

}
