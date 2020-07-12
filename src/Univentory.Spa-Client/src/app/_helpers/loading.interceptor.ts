import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LoadingScreenService } from "src/app/_services/componentservice/loading-screen";

/**
 * Loading interceptor
 */
@Injectable()
export class LoadingScreenInterceptor implements HttpInterceptor {

    /**
     * Value of the active HTTP request
     */
    activeRequests: number = 0;

    /**
     * URLs for which the loading screen should not be enabled
     */
    skippUrls = [
        //'/authrefresh',
        '/login'
    ];

    /**
     * @ignore
     */
    constructor(private loadingScreenService: LoadingScreenService) {
    }

     /**
     *Use loader while making any HTTP request
     *@example
     *intercept()
     *@returns {void}
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let displayLoadingScreen = true;
        //let displayLoadingScreen:any = request.params.get('status');
        for (const skippUrl of this.skippUrls) {
            if (new RegExp(skippUrl).test(request.url)) {
                displayLoadingScreen = false;
                break;
            }
        }

        if (displayLoadingScreen) {
            if (this.activeRequests === 0) {
                this.loadingScreenService.startLoading();
            }
            this.activeRequests++;

            return next.handle(request).pipe(
                finalize(() => {
                    this.activeRequests--;
                    if (this.activeRequests === 0) {
                        this.loadingScreenService.stopLoading();
                    }
                })
            )
        } else {
            return next.handle(request);
        }
    };
}
