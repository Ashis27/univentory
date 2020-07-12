import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { ConfigService } from 'src/app/shared/services/config.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ConsumerService {
    private serviceUrl: string = '';

    constructor(private httpService: HttpService, private configService: ConfigService) {
        if (this.configService.isReady) {
            this.serviceUrl = this.configService.serverSettings.apiServiceUrl;
        }

    }

    
  addConsumer(consumer): Observable<any> {
    return this.httpService.post(this.serviceUrl + "api/user/create/consumer", consumer)
      .pipe(map(response => {
        return response;
      }));
  }

  getConsumers(searchKeyword, pageIndex, pageSize): Observable<any> {
    return this.httpService.get(this.serviceUrl + "api/user/consumer/search?searchKeyword=" + searchKeyword + "&pageIndex=" + pageIndex + "&pageSize=" + pageSize)
      .pipe(map(response => {
        return response;
      }));
  }

  updateConsumer(consumer): Observable<any> {
    return this.httpService.put(this.serviceUrl + "api/user/update/consumer", consumer)
      .pipe(map(response => {
        return response;
      }));
  }

  updateUserProfile(user): Observable<any> {
    return this.httpService.put(this.serviceUrl + "api/user/update/user", user)
      .pipe(map(response => {
        return response;
      }));
  }

  getUserProfile(): Observable<any> {
    return this.httpService.get(this.serviceUrl + "api/user/profile")
      .pipe(map(response => {
        return response;
      }));
  }
}