import { Injectable } from '@angular/core';
import { IServiceList } from '../interfaces/IServiceList';
import { IAppConfiguration } from '../interfaces/IAppConfiguration';
import { ILanguageInfo } from '../interfaces/ILanguage';

/*
  Generated class for the ApiServicesHandlerService handler.
*/
export abstract class ApiServicesHandlerService {
      /**
   Value of the app name
   */
    static readonly _app_name: string = "HiroshimaQRApp";
    
      /**
   Value of all API services
   */
    static readonly _api_services = {
        
        //Configuration services
        languageContent: { controller: "Configuration", method: "GetLanguageContent", api: "api/Configuration/LanguageContent" },
        activeLanguage: { controller: "Configuration", method: "GetActiveLanguages", api: "api/Configuration/ActiveLanguages" },
        getActiveCurrency: { controller: "Configuration", method: "GetActiveCurriencies", api: "api/Configuration/ActiveCurriencies" },
        getBookingIngo: { controller: "Configuration", method: "GetBookingInformation", api: "api/Configuration/BookingInformation" },
        getTravellerFeedback: { controller: "Configuration", method: "GetTravellerFeedback", api: "api/Configuration/GetFeedback" },
        getQRConfig: { controller: "Configuration", method: "GetQRConfiguration", api: "api/Configuration/GetQRConfigurationInfo" },
        updateQRConfig: { controller: "Configuration", method: "UpdateQRCodeRegerateTime", api: "api/Configuration/UpdateQRConfiguration" },
       
        //Admin Authentication services 
        userLogin: { controller: "Admin", method: "Authenticate", api: "api/Admin/Authenticate" },
        registerSuperAdmin: { controller: "Admin", method: "RegisterSuperAdmin", api: "api/Admin/NECAdmin" },
        registerAdmin: { controller: "Admin", method: "RegisterAdmin", api: "api/Admin/SuperAdmin" },
        getSuperAdmin: { controller: "Admin", method: "GetAllSuperAdmins", api: "api/Admin/NECAdmin" },
        getAdmin: { controller: "Admin", method: "GetAllAdmins", api: "api/Admin/SuperAdmin" },
        updateSuperAdmin: { controller: "Admin", method: "UpdateSuperAdmin", api: "api/Admin/NECAdmin" },
        updateAdmin: { controller: "Admin", method: "UpdateAdmin", api: "api/Admin/SuperAdmin" },
        deleteAdmin: { controller: "Admin", method: "DeleteAdmin", api: "api/Admin/SuperAdmin" },
        logout: { controller: "Admin", method: "Logout", api: "api/Admin/Logout" },
        
        //Pass services
        createPass: { controller: "Pass", method: "CreateNewPass", api: "api/Pass/CreatePass" },
        updatePass: { controller: "Pass", method: "UpdatePassInformation", api: "api/Pass/UpdatePass" },
        getPasses: { controller: "Pass", method: "GetAllActivePasses", api: "api/Pass/GetAllPass" },
        getPass: { controller: "Pass", method: "GetActivePass", api: "api/Pass/GetPass" }, 
        deletePass: { controller: "Pass", method: "DeletePass", api: "api/Pass/DeletePass" },
        getPassLanguages: { controller: "Pass", method: "GetAvailableLanguages", api: "api/Pass/PassInformation" }, 

        //PTO services
        createPTO: { controller: "PTO", method: "CreatePTO", api: "api/PTO/CreatePTO" },
        updatePTO: { controller: "PTO", method: "UpdatePTO", api: "api/PTO/UpdatePTO" },
        getPTOs: { controller: "PTO", method: "GetAllPTO", api: "api/PTO/GetAllPTO" },
        getPTO: { controller: "PTO", method: "GetPTO", api: "api/PTO/GetPTO" }, 
        getPTOLanguages: { controller: "PTO", method: "GetAvailableLanguages", api: "api/PTO/PTOInformation" }, 
        deletePTO: { controller: "PTO", method: "DeletePTO", api: "api/PTO/DeletePTO" },

    
    };
    
      /**
   Value of app confogurations
   */
    static readonly _app_config: Array<IAppConfiguration> = [
        {
            envName: "LOCAL",
            apiServices:
                {
                    remoteServiceBaseUrl: "http://localhost:21021/",
                },
            version: "1.0.0"
        },
        {
            envName: "UAT",
            apiServices:
                {
                    remoteServiceBaseUrl: "http://54.84.255.41:8080/",
                },
            version: "1.0.0"
        },
        {
            envName: "STAG",
            apiServices:
                {
                    remoteServiceBaseUrl: "http://kare4u-lb-bpms-ind-prod2-consume-2031991078.us-east-1.elb.amazonaws.com:8120/",
                },
            version: "1.0.0"
        },
        {
            envName: "PROD",
            apiServices:
                {
                    remoteServiceBaseUrl: "http://kare4u-lb-bpms-ind-prod2-consume-2031991078.us-east-1.elb.amazonaws.com:8120/",
                },
            version: "1.0.0"
        }
    ];
        /**
     Value of the cache keys
     */
    static readonly _cache_key_value = {
        appAuthTokenName: 'app_auth_token',
        activeLanguageInfo: 'active_lang_info',
        activeCurriencies:'active_currencies',
        loggedInUser:'logged_in_user_info'
    };
     
}