import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from 'src/app/_services';
  
//import { AuthenticationService } from 'src/app/_services';

/**
 * Auth guard service
 */
@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
    /**
     * @ignore
     */
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    /**
     * To check auth status while page redirection
     * @example
     * canActivate()
     * @returns {boolean} True | False
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // const currentUser = this.authenticationService.currentUserValue;
        // if (currentUser) {
        //     // logged in so return true
        //     return true;
        // }
        if (!this.authenticationService.isAuthenticated()) {
      //  if (!currentUser || !currentUser.authToken) {
            // not logged in so redirect to login page with the return url
            this.authenticationService.logout();
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            return false;
        }
        return true;
    }
}