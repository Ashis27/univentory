import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/*
  Generated class for the Loading-screen  provider.
*/
@Injectable({
  providedIn: 'root'
})
export class LoadingScreenService {

  /**
  * Value of the loading status
  */
  private _loading: boolean = false;
  /**
   * Update the loading value whenever gets changed 
   */
  loadingStatus: BehaviorSubject<any> = new BehaviorSubject<any>(this._loading);

  /**
   * get active loader status
   */
  get loading(): boolean {
    return this._loading;
  }

  /**
   * set loader status
   */
  set loading(value) {
    this._loading = value;
    this.loadingStatus.next(value);
  }

  /**
   * Start loading while API call   
   */
  startLoading() {
    this.loading = true;
  }


  /**
   * Stop loading while API gives the response
   */
  stopLoading() {
    this.loading = false;
  }
}