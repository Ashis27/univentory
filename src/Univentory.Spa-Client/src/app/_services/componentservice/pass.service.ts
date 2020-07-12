import { Injectable } from '@angular/core';
import { HttpServiceProvider } from 'src/app/_services/http.services';
import { AppConfigurationServiceProvider } from 'src/app/_services/app.configuration.service';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { AdminUser } from 'src/app/shared/models/AdminUser';
import { PassModel, SearchParams } from 'src/app/shared/models';

/*
  Generated class for the admin.service provider.
*/
@Injectable({ providedIn: 'root' })
export class PassServiceProvider {

    /**
     * @ignore
     */
    constructor(private _http: HttpServiceProvider, private _app_config_service: AppConfigurationServiceProvider) {

    }
    
    /**
    * To create a new pass
    * @example  
    * CreatePass(passInfo)
    * @param {PassModel} passInfo pass information
    * @returns {boolean}
    */ 
    CreatePass = (passInfo: PassModel): Observable<any> => {
        return this._http.post(this._app_config_service.getApiService("createPass").toString() + "/" + passInfo, passInfo)
            .pipe(tap(response => {
                return response;
            }));
    }

    /**
    * To update existing pass by pass id
    * @example  
    * UpdatePass(searchParams)
    * @param {PassModel} passInfo pass information
    * @returns {boolean}
    */ 
    UpdatePass = (passInfo: PassModel): Observable<any> => {
        return this._http.put(this._app_config_service.getApiService("updatePass").toString() + "/" + passInfo, passInfo)
            .pipe(tap(response => {
                return response;
            }));
    }

    /**
    * Get active passes
    * @example  
    * GetPasses(searchParams)
    * @param {SearchParams} searchParams pagination details
    * @returns {List} pass information
    */
    GetPasses = (searchParams: SearchParams): Observable<any> => {
        return this._http.post(this._app_config_service.getApiService("getPasses").toString() + "/" + searchParams, searchParams)
            .pipe(tap(response => {
                return response;
            }));
    }

    /**
    * To get selected pass information by indivisual pass id
    * @example
    * GetPass(en,1)
    * @param {number} lang language id
    * @param {number} id pass id
    * @returns {PassModel} pass information
    */
    GetPass = (lang: number, id: number): Observable<any> => {
        return this._http.get(this._app_config_service.getApiService("getPass").toString() + "/" + id + "/Onlanguage/" + lang)
            .pipe(tap(response => {
                return response;
            }));
    }
    /**
    * To delete selected pass by pass id
    * @example  
    * DeletePass(1)
    * @param {number} id pass information id
    * @returns {boolean}
    */ 
    DeletePass = (id: number): Observable<any> => {
        return this._http.delete(this._app_config_service.getApiService("deletePass").toString() + "/" + id)
            .pipe(tap(response => {
                return response;
            }));
    }

    /**
    * To get all available languages which is not yet added in Pass description
    * @example  
    * GetAvailableLanguages(1)
    * @param {number} id pass information id
    * @returns {List} language information
    */ 
    GetAvailableLanguages = (id: number): Observable<any> => {
        return this._http.get(this._app_config_service.getApiService("getPassLanguages").toString() + "/" + id + "/AvailableLanguage")
            .pipe(tap(response => {
                return response;
            }));
    }

}
