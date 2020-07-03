import { Injectable } from '@angular/core';
import { HttpServiceProvider } from 'src/app/_services/http.services';
import { AppConfigurationServiceProvider } from 'src/app/_services/app.configuration.service';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { SearchParams } from 'src/app/shared/models';
import { QRCodeConfigurationModel } from 'src/app/shared/models/QRCodeConfigurationModel';

/*
  Generated class for the login.service provider.
*/
@Injectable({ providedIn: 'root' })
export class ConfigurationServiceProvider {
    /**
     * @ignore
     */
    constructor(public _http: HttpServiceProvider, private _app_config_service: AppConfigurationServiceProvider) {

    }


    /**
     * Get active languages
     * @example
     * GetActiveLanguages(searchParams,false)
     * @param {SearchParams} searchParams pagination information
     * @param {boolean} status True | False
     * @returns {object} app configuration
     */
    GetActiveLanguages = (searchParams: SearchParams, status: boolean): Observable<any> => {
        return this._http.post(this._app_config_service.getApiService("activeLanguage").toString() + "/" + searchParams, searchParams)
            .pipe(tap(response => {
                return response;
            }));
    }

    /**
   * Get active language contents based on selected language
   * @example
   * GetActiveLanguageContents('en')
   * @param {string} lang selected language name
   * @param {boolean} status True | False
   * @returns {object} app configuration
   */
    GetActiveLanguageContents = (lang: string): Observable<any> => {
        return this._http.get(this._app_config_service.getApiService("languageContent").toString() + "/OnLanguage/" + lang)
            .pipe(tap(response => {
                return response;
            }));
    }

    /**
   * Get active currencies
   * @example
   * GetActiveCurriencies(searchParams)
   * @param {SearchParams} searchParams Pagination information
   * @returns {List} active currencies
   */
    GetActiveCurriencies = (searchParams: SearchParams): Observable<any> => {
        return this._http.post(this._app_config_service.getApiService("getActiveCurrency").toString() + "/" + searchParams, searchParams)
            .pipe(tap(response => {
                return response;
            }));
    }

    /**
  * Get booking information
  * @example
  * GetBookingInfo(searchParams)
  * @param {SearchParams} searchParams Pagination information
  * @returns {List} booking information
  */
    GetBookingInfo = (searchParams: SearchParams): Observable<any> => {
        return this._http.post(this._app_config_service.getApiService("getBookingIngo").toString() + "/" + searchParams, searchParams)
            .pipe(tap(response => {
                return response;
            }));
    }
    /**
     * Get traveller feedback information, which is submitted by user
       * GetBookingInfo(searchParams)
       * @param {SearchParams} searchParams Pagination information
       * @returns {List} traveller information
     */
    GetActiveFeedback = (searchParams: SearchParams): Observable<any> => {
        return this._http.post(this._app_config_service.getApiService("getTravellerFeedback").toString() + "/" + searchParams, searchParams)
            .pipe(tap(response => {
                return response;
            }));
    }

    /**
    * Get QR configuration information 
    * GetQRConfiguration()
    * @returns {object} QR configuration information
    */
    GetQRConfiguration = (): Observable<any> => {
        return this._http.get(this._app_config_service.getApiService("getQRConfig").toString())
            .pipe(tap(response => {
                return response;
            }));
    }

    /**
    * Get QR configuration information 
    * UpdateQRConfiguration(1,10)
    * @param {QRCodeConfigurationModel} configInfo configuration information
    * @returns {boolean}
    */
    UpdateQRConfiguration = (configInfo: QRCodeConfigurationModel): Observable<any> => {
        return this._http.put(this._app_config_service.getApiService("updateQRConfig").toString() + "/" + configInfo, configInfo)
            .pipe(tap(response => {
                return response;
            }));
    }
}
