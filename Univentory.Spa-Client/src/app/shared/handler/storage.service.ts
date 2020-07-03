import { Injectable, Injector } from '@angular/core';

/*
  Generated class for the StorageHandlerService service.
*/
@Injectable({ providedIn: 'root' })
export abstract class StorageHandlerService {

  /**
  *@ignore 
  */
    constructor(
    ) {

    }
        /**
     * To store the date againt local storage key in local storage
     * @example
     * setStoreDataIncache("https://localhost","Hi",{data})
     * @param {string} url API base URL for unique key
     * @param {string} uKey local storage key name
     * @param {string} data data to be stored in local storage
     */
    setStoreDataIncache(url, uKey, data) {
       return localStorage.setItem(uKey, data);
    }

        /**
     * To get the stored result from local storage
     * @example
     * getStoreDataFromCache("Hi")
     * @param {string} key local storage key name to get the data from local storage
     */
    getStoreDataFromCache(key) {
       return localStorage.getItem(key);
    }
}
