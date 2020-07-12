import { Component, OnInit } from '@angular/core';
import { ISearchParams } from 'src/app/shared/services/interfaces/ISearchParams';
import { AuthService } from 'src/app/shared/authentication/auth.service';
import { ProductService } from './product.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {

  paginatedItems = {
    items: [],
    TotalCount: 0,
    TotalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  }
  searchParams: ISearchParams;
  isAvaileble: boolean = true;
  title: string = "Products";
  searchProductKeyword: string = '';
  vendorId: number = 0;
  isActiveProduct: boolean = true;

  constructor(private productService: ProductService,
    private notification: NotificationService, public router: Router) {
    this.vendorId = window.history.state?.vendorId;
  }

  ngOnInit(): void {
    this.searchParams = {
      UserId: 0,
      IsActive: true,
      Keyword: this.searchProductKeyword,
      Name: "",
      Code: "",
      PageIndex: 1,
      PageSize: 10
    } as ISearchParams;

    if (this.vendorId > 0) {
      this.getProductsByVendorId();
    }
    else {
      this.getProducts();
    }
  }

  getProducts() {
    this.searchParams.Keyword = this.searchProductKeyword;
    this.productService.getProducts(this.searchParams)
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

  getProductsByVendorId() {
    this.productService.getProductsByVendorId(this.vendorId,this.searchParams.PageIndex,this.searchParams.PageSize,this.isActiveProduct)
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


  addProduct() {
    this.router.navigate(['/service/create-product']);
  }

  getProductHistory(id) {

  }
  editProduct(item) {
    this.router.navigate(['/service/edit-product'], {
      state: { productItem: item }
    });
  }

  prev() {
    if (!this.paginatedItems.hasPreviousPage)
      return;
    this.searchParams.PageIndex -= this.searchParams.PageIndex;
    this.getProducts();
  }
  next() {
    if (!this.paginatedItems.hasNextPage)
      return;
    this.searchParams.PageIndex += this.searchParams.PageIndex;
    this.getProducts();
  }
}
