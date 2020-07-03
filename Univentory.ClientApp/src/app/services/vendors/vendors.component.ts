import { Component, OnInit } from '@angular/core';
import { ISearchParams } from 'src/app/shared/services/interfaces/ISearchParams';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthService } from 'src/app/shared/authentication/auth.service';
import { Router } from '@angular/router';
import { VendorService } from './vendor.service';


@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.scss']
})
export class VendorsComponent implements OnInit {

  paginatedItems = {
    items: [],
    TotalCount: 0,
    TotalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  }
  searchParams: ISearchParams;
  isAvaileble: boolean = true;
  title: string = "Vendors";
  searchVendorKeyword: string = '';
  pageIndex: number = 1;
  pageSize: number = 10;

  constructor(private vendorService: VendorService, private notification: NotificationService,
    public router: Router) { }

  ngOnInit(): void {
    this.getVendors();
  }

  getVendors() {
    this.vendorService.getVendors(this.searchVendorKeyword, this.pageIndex, this.pageSize)
      .subscribe((data: any) => {
        if (data.items.length == 0) {
          this.isAvaileble = false;
        }
        this.paginatedItems = data;
      },
        error => {
          this.isAvaileble = false;
          return this.notification.errorMessage(error);
        });
  }

  addVendor() {
    this.router.navigate(['/service/create-vendor']);
  }

  getVendorHistory(id) {
    this.router.navigate(['/service/products'], {
      state: { vendorId: id }
    });
  }
  
  editVendor(item) {
    this.router.navigate(['/service/edit-vendor'], {
      state: { vendorData: item }
    });
  }

  prev() {
    if (!this.paginatedItems.hasPreviousPage)
      return;

    this.pageIndex = this.pageIndex - 1;
    this.getVendors();
  }
  next() {
    if (!this.paginatedItems.hasNextPage)
      return;

    this.pageIndex = this.pageIndex + 1;
    this.getVendors();
  }
}
