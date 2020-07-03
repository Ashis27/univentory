import { Injectable } from '@angular/core';
import { HttpServiceProvider } from 'src/app/_services/http.services';
import { AppConfigurationServiceProvider } from 'src/app/_services/app.configuration.service';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { AdminUser } from 'src/app/shared/models/AdminUser';
import { SearchParams } from 'src/app/shared/models';

/*
  Generated class for the admin.service provider.
*/
@Injectable({ providedIn: 'root' })
export class AdminServiceProvider {
    /**
     * @ignore
     */
    constructor(private _http: HttpServiceProvider, private _app_config_service: AppConfigurationServiceProvider) {

    }
    /**
     * To create new super admin user by NEC admin
     * @example
     * RegisterSuperAdmin({adminInformation},NECAdminId)
     * @param {AdminUser} userData admin user information
     * @param {number} id NEC admin id
     * @returns {boolean}
     */
    RegisterSuperAdmin = (userData: AdminUser, id: number): Observable<any> => {
        return this._http.post(this._app_config_service.getApiService("registerSuperAdmin").toString() + "/" + id + "/CreateSuperAdmin/" + userData, userData)
            .pipe(tap(response => {
                return response;
            }));
    }
     /**
     * To create new admin user by super admin
     * @example
     * RegisterAdmin({adminInformation},SuperAdminId)
     * @param {AdminUser} userData admin user information
     * @param {number} id super admin id
     * @returns {boolean}
     */
    RegisterAdmin = (userData: AdminUser, id: number): Observable<any> => {
        return this._http.post(this._app_config_service.getApiService("registerAdmin").toString() + "/" + id + "/CreateAdmin/" + userData, userData)
            .pipe(tap(response => {
                return response;
            }));
    }
    /**
     * To get active super admins
     * @example
     * GetSuperAdmins(NECAdminId)
     * @param {number} id nec admin id
     * @returns {List} admin users
     */
    GetSuperAdmins = (id: number): Observable<any> => {
        return this._http.get(this._app_config_service.getApiService("getSuperAdmin").toString() + "/" + id + "/SuperAdmins")
            .pipe(tap(response => {
                return response;
            }));
    }
    /**
     * To get active admins
     * @example
     * GetAdmins(SuperAdminId)
     * @param {number} id super admin id
     * @returns {List} admin users
     */
    GetAdmins = (id: number): Observable<any> => {
        return this._http.get(this._app_config_service.getApiService("getAdmin").toString() + "/" + id + "/Admins")
            .pipe(tap(response => {
                return response;
            }));
    }
    /**
     * To update super admin information by NEC admin
     * @example
     * UpdateSuperAdmin(SuperAdminId)
     * @param {AdminUser} userData admin user information
     * @param {number} id nec admin id
     * @returns {boolean}
     */
    UpdateSuperAdmin = (userData: AdminUser, id: number): Observable<any> => {
        return this._http.post(this._app_config_service.getApiService("updateSuperAdmin").toString() + "/" + id + "/UpdateSuperAdminInfo/" + userData, userData)
            .pipe(tap(response => {
                return response;
            }));
    }

    /**
     * To update admin user information by super admin
     * @example
     * UpdateAdmin({adminInformation},SuperAdminId)
     * @param {AdminUser} userData admin user information
     * @param {number} id super admin id
     * @returns {boolean}
     */
    UpdateAdmin = (userData: AdminUser, id: number): Observable<any> => {
        return this._http.post(this._app_config_service.getApiService("updateAdmin").toString() + "/" + id + "/UpdateAdminInfo/" + userData, userData)
            .pipe(tap(response => {
                return response;
            }));
    }

    /**
     * To delete admin user by super admin
     * @example
     * UpdateAdmin(SuperAdminId,AdminId)
     * @param {number} superAdminId super admin id
     * @param {number} adminId admin id
     * @returns {boolean}
     */
    DeleteAdmin = (superAdminId: number, adminId: number): Observable<any> => {
        return this._http.delete(this._app_config_service.getApiService("deleteAdmin").toString() + "/" + superAdminId + "/Admin/" + adminId)
            .pipe(tap(response => {
                return response;
            }));
    }
}
