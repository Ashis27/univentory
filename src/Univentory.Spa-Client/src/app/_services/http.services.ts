import { Injectable, Injector } from '@angular/core';
import { AppConfigurationServiceProvider } from './app.configuration.service';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

/*
 * Generated class for the http.service provider.
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
*/
@Injectable({ providedIn: 'root' })
export class HttpServiceProvider {

    /**
     *@ignore
     */
    constructor(private _http: HttpClient, private _app_config_service: AppConfigurationServiceProvider) { }

    /**
     * HTTP get service
     * @param {string} url api url to get data
     * @param {boolean} status True | false (Use loader or not)
     * @returns HTTP response
     */
    get(url: string, status?: any): Observable<any> {
        return this._http.get<any>(this._app_config_service.getRemoteServiceBaseUrl() + url);
    }

    
    /**
     * HTTP post service
     * @param {string} url api url to get data
     * @param {object} model data to be stored in DB
     * @param {boolean} status True | false (Use loader or not)
     * @returns HTTP response
     */
    post(url: string, model: any, status?: any): Observable<any> {
        return this._http.post<any>(this._app_config_service.getRemoteServiceBaseUrl() + url, model);
    }

     /**
     * HTTP put service
     * @param {string} url api url to get data
     * @param {object} model data to be stored in DB
     * @returns HTTP response
     */
    put(url: string, model: any): Observable<Response> {
        return this._http.put(this._app_config_service.getRemoteServiceBaseUrl() + url, model);
    }

     /**
     * HTTP delete service
     * @param {string} url api url to get data
     * @returns HTTP response
     */
    delete(url: string): Observable<Response> {
        return this._http.delete<any>(this._app_config_service.getRemoteServiceBaseUrl() + url);
    }
}
