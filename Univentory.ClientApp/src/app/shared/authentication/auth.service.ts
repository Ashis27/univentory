import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpService } from '../services/http.service';
import { StorageService } from '../services/storage.service';
import { map } from 'rxjs/operators';
import { IUser } from '../services/interfaces/IUser';

@Injectable()
export class AuthService {
  // Observable navItem source
  private _authNavStatusSource = new BehaviorSubject<boolean>(false);

  /**
 * JWT helper service to get the token information
 */
  private _jwtHelper = new JwtHelperService();
  private loginResponse: any;
  // Observable navItem stream
  authNavStatus$ = this._authNavStatusSource.asObservable();
  private user: IUser;
  private serviceUrl: string;

  constructor(private httpService: HttpService, private configService: ConfigService,
    private storage: StorageService) {

    if (this.configService.isReady) {
      this.serviceUrl = this.configService.serverSettings.apiServiceUrl;
    }

    this.user = this.storage.retrieve("loggedin_info");
    if (this.user) {
      this._authNavStatusSource.next(this.isAuthenticated());
    }
  }


  async completeAuthentication(data) {
    this.user = {
      name: data.userName,
      id: data.id,
      access_token: data.authToken,
      refresh_token: data.refreshToken,
      token_type: "Bearer",
      mobileNumber: data.mobileNumber,
      address: data.address,
      shopName:data.shopName,
      gstNumber:data.gstNumber
    } as IUser;

    this.storage.store("loggedin_info", this.user);
    this._authNavStatusSource.next(this.isAuthenticated());
  }

  login(loginData): Observable<any> {
    return this.httpService.post(this.configService.serverSettings.apiServiceUrl + "api/user/authenticate", loginData)
      .pipe(map(response => {
        return response;
      }));
  }

  register(userRegistration: any) {

  }

  isAuthenticated(): boolean {
    return this.user && this.isAuthenticatedByJwtHelper();
  }

  isAuthenticatedByJwtHelper(): boolean {
    const token = this.user.access_token;
    return !this._jwtHelper.isTokenExpired(token);
  }

  decodeToken(): boolean {
    if (this._authNavStatusSource.value) {
      const token = this.user.access_token;
      // Check whether the token is expired and return
      // true or false
      return this._jwtHelper.decodeToken(token);
    }
    else
      return false;
  }

  get authorizationHeaderValue(): string {
    return `${this.user.token_type} ${this.user.access_token}`;
  }

  get authorizationToken(): string {
    return `${this.user.access_token}`;
  }

  get name(): string {
    return this.user != null ? this.user.name : '';
  }

  get userId(): number {
    return this.user != null ? parseInt(this.user.id) : 0;
  }

  userInfo() {
    return this.user;
  }

  async signout() {
    this.storage.clear("loggedin_info");
    this._authNavStatusSource.next(null);
  }
}


