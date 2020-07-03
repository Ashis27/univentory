import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from 'src/app/_models';
import { ApiServicesHandlerService } from 'src/app/shared/handler/app.constant';
import { LanguageService } from 'src/app/shared/interfaces/ILanguage';
import { AdminUser } from 'src/app/shared/models/AdminUser';
import { AppConfigurationServiceProvider } from 'src/app/_services';

/*
  Generated class for the AuthenticationService provider.
*/
@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    /**
     * Value of the current user information from local storage 
     */
    private currentUserSubject: BehaviorSubject<User>;
    /**
     * Value of the current user information
     */
    public currentUser: Observable<User>;

    /**
     * JWT helper service to get the token information
     */
    private jwtHelper = new JwtHelperService();
    /**
    * App configuration service to access the config information 
    */
    private app_config_service = new AppConfigurationServiceProvider();
    /**
 * @ignore
 */
    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem(ApiServicesHandlerService._cache_key_value.appAuthTokenName)));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    /**
     * To get current user information
     * @example
     * currentUserValue()
     * @returns {object} user information
     */
    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }
    /**
    * To check authentication status with expiry of the token
    * @example
    * isAuthenticated()
    * @returns {boolean}
    */
    public isAuthenticated(): boolean {
        if (this.currentUserSubject.value) {
            const token = this.currentUserSubject.value.authToken;
            // Check whether the token is expired and return
            // true or false
            return !this.jwtHelper.isTokenExpired(token);
        }
        else
            return false;
    }

    /**
     * To decode the token to get the token information along with additional information
     * @example
     * decodeToken()
     * @returns {boolean}
     */
    public decodeToken(): boolean {
        if (this.currentUserSubject.value) {
            const token = this.currentUserSubject.value.authToken;
            // Check whether the token is expired and return
            // true or false
            return this.jwtHelper.decodeToken(token);
        }
        else
            return false;
    }

    /**
     * User authentication
     * @example
     * Login(userInformation)
     * @param {AdminUser} userDate user information
     * @returns {boolean}
     */
    Login = (userData: AdminUser): Observable<any> => {
        return this.http.post<any>(this.app_config_service.getRemoteServiceBaseUrl() + "/api/Admin/Authenticate", userData)
            .pipe(map(response => {
                // login successful if there's a jwt token in the response
                if (response && response.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem(ApiServicesHandlerService._cache_key_value.appAuthTokenName, JSON.stringify(response.token));
                    this.currentUserSubject.next(response.token);
                }
                return response;
            }));
    }

    /**
     * Logout and remove the token information from local storage
     * @example
     * logout()
     * @returns {boolean}
     */
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem(ApiServicesHandlerService._cache_key_value.appAuthTokenName);
        this.currentUserSubject.next(null);
    }
}