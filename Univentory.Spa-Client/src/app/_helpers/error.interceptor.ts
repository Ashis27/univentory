import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/_services';

/**
 * Error interceptor
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    /**
     * @ignore
     */
    constructor(private authenticationService: AuthenticationService) { }

    /**
     *Throw error while throwing any error from API
     *@example
     *intercept()
     *@returns {void}
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        if (navigator.onLine)
            return next.handle(request).pipe(catchError(err => {
                if ([401, 403].indexOf(err.status) !== -1) {
                    // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                    this.authenticationService.logout();
                    window.location.href = "/";
                    return throwError("SessionExpired");
                }
                return throwError(err.error.message);
            }));
        else
            return Observable.throw("OfflineMessage");
    }
}