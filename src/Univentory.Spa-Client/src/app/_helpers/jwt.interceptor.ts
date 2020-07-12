import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from 'src/app/_services';

/**
 * JWT auth interceptor
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
     /**
     *@ignore
     */
    constructor(private authenticationService: AuthenticationService) { }
    /**
     *Set JWT token in HTTP request header
     *@example
     *intercept()
     *@returns {void}
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.authToken) {
            request = request.clone({
                setHeaders: {
                    headers:`Access-Control-Allow-Origin', '*','Accept', 'application/json','Content-Type', 'application/json'`,
                    Authorization: `Bearer ${currentUser.authToken}`
                }
            });
        }
        return next.handle(request);
    }
}