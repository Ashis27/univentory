import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { ConfigService } from 'src/app/shared/services/config.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class VendorService {
    private serviceUrl: string = '';

    constructor(private httpService: HttpService, private configService: ConfigService) {
        if (this.configService.isReady) {
            this.serviceUrl = this.configService.serverSettings.apiServiceUrl;
        }

    }

    
  addVendor(vendor): Observable<any> {
    return this.httpService.post(this.serviceUrl + "api/user/create/vendor", vendor)
      .pipe(map(response => {
        return response;
      }));
  }

  getVendors(searchKeyword, pageIndex, pageSize): Observable<any> {
    return this.httpService.get(this.serviceUrl + "api/user/vendor/search?searchKeyword=" + searchKeyword + "&pageIndex=" + pageIndex + "&pageSize=" + pageSize)
      .pipe(map(response => {
        return response;
      }));
  }

  updateVendor(vendor): Observable<any> {
    return this.httpService.put(this.serviceUrl + "api/user/update/vendor", vendor)
      .pipe(map(response => {
        return response;
      }));
  }
}