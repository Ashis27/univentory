import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { Observable } from 'rxjs';
import { ConfigService } from 'src/app/shared/services/config.service';
import { map } from 'rxjs/operators';

@Injectable()
export class ProductService {
  private serviceUrl: string = '';

  constructor(private httpService: HttpService, private configService: ConfigService) {
    if (this.configService.isReady) {
      this.serviceUrl = this.configService.serverSettings.apiServiceUrl;
    }

  }

  getProducts(searchParams): Observable<any> {
    return this.httpService.post(this.serviceUrl + "api/product/items", searchParams)
      .pipe(map(response => {
        return response;
      }));
  }

  addProduct(productItem): Observable<any> {
    return this.httpService.post(this.serviceUrl + "api/product/create", productItem)
      .pipe(map(response => {
        return response;
      }));
  }

  updateProduct(productItem): Observable<any> {
    return this.httpService.put(this.serviceUrl + "api/product/update", productItem)
      .pipe(map(response => {
        return response;
      }));
  }


  addCategory(categoryItem): Observable<any> {
    return this.httpService.post(this.serviceUrl + "api/category/create", categoryItem)
      .pipe(map(response => {
        return response;
      }));
  }

  addBrand(brandItem): Observable<any> {
    return this.httpService.post(this.serviceUrl + "api/brand/create", brandItem)
      .pipe(map(response => {
        return response;
      }));
  }


  addVendor(vendor): Observable<any> {
    return this.httpService.post(this.serviceUrl + "api/user/create/vendor", vendor)
      .pipe(map(response => {
        return response;
      }));
  }


  getCategories(searchKeyword, pageIndex, pageSize): Observable<any> {
    return this.httpService.get(this.serviceUrl + "api/category/searchitems?searchKeyword=" + searchKeyword + "&pageIndex=" + pageIndex + "&pageSize=" + pageSize)
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

  getBrands(searchKeyword, pageIndex, pageSize): Observable<any> {
    return this.httpService.get(this.serviceUrl + "api/brand/searchitems?searchKeyword=" + searchKeyword + "&pageIndex=" + pageIndex + "&pageSize=" + pageSize)
      .pipe(map(response => {
        return response;
      }));
  }

  getProductsByVendorId(vendorId, pageIndex, pageSize, isActive): Observable<any> {
    return this.httpService.get(this.serviceUrl + "api/product/items/vendorProductHistory/" + vendorId + "?pageIndex=" + pageIndex + "&pageSize=" + pageSize + "&isActive=" + isActive)
      .pipe(map(response => {
        return response;
      }));
  }
}
