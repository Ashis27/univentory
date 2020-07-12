import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from 'src/app/_models';
import { Observable } from 'rxjs';
import { AppConfigurationServiceProvider, HttpServiceProvider } from 'src/app/_services';
import { tap } from 'rxjs/operators';

/**
 * Generated class for the user.service.
 */
@Injectable({ providedIn: 'root' })
export class UserService {

    /**
     * @ignore
     */
    constructor(private _http: HttpServiceProvider, private _app_config_service: AppConfigurationServiceProvider) { }

    /**
     * To get all active users
     * @example
     * getAll()
     * @returns {List} users
     * 
     */
    getAll() {

    }
    /**
    * To get active user information
    * @example
    * getById(1)
    * @param {number} id user id
    * @returns {object} user information
    * 
    */
    getById(id: number) {

    }

    /**
    * Logout and remove the token information from local storage
    * @example
    * Logout()
    * @returns {boolean}
    */
    Logout = (): Observable<any> => {
        return this._http.get(this._app_config_service.getApiService("logout").toString())
            .pipe(tap(response => {
                return response;
            }));
    }
}