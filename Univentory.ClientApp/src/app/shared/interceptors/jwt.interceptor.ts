import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../authentication/auth.service';
import { Guid } from '../guid';


/**
 * JWT auth interceptor
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    /**
    *@ignore
    */
    constructor(private authenticationService: AuthService) { }
    /**
     *Set JWT token in HTTP request header
     *@example
     *intercept()
     *@returns {void}
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        if (this.authenticationService.isAuthenticated()) {
            let authToken = this.authenticationService?.authorizationHeaderValue;
            if (authToken && authToken != null) {
                request = request.clone({
                    setHeaders: {
                        headers: `Access-Control-Allow-Origin', '*','Accept', 'application/json','Content-Type', 'application/json'`,
                        Authorization: authToken,
                        "x-requestid": Guid.newGuid()
                    }
                });
            }
            return next.handle(request);
        }
        return next.handle(request);
    }
}