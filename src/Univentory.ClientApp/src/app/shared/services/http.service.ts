import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class HttpService {

    /**
     *@ignore
     */
    constructor(private http: HttpClient) { }

    /**
     * HTTP get service
     * @param {string} url api url to get data
     * @param {boolean} status True | false (Use loader or not)
     * @returns HTTP response
     */
    get(url: string): Observable<Response> {
        return this.http.get<Response>(url);
    }

    /**
     * HTTP post service
     * @param {string} url api url to get data
     * @param {object} model data to be stored in DB
     * @param {boolean} status True | false (Use loader or not)
     * @returns HTTP response
     */
    post(url: string, model: any): Observable<Response> {
        return this.http.post<Response>(url, model);
    }

    /**
    * HTTP put service
    * @param {string} url api url to get data
    * @param {object} model data to be stored in DB
    * @returns HTTP response
    */
    put(url: string, model: any): Observable<Response> {
        return this.http.put<Response>(url, model);
    }

    /**
    * HTTP delete service
    * @param {string} url api url to get data
    * @returns HTTP response
    */
    delete(url: string): Observable<Response> {
        return this.http.delete<Response>(url);
    }
}