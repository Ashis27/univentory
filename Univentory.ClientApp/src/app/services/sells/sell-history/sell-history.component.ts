import { Component, OnInit } from '@angular/core';
import { SaleProductService } from '../sell-product.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sell-history',
  templateUrl: './sell-history.component.html',
  styleUrls: ['./sell-history.component.scss'],
  providers: [DatePipe]
})
export class SellHistoryComponent implements OnInit {
  paginatedItems = {
    items: [],
    TotalCount: 0,
    TotalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  }
  isAvaileble: boolean = true;
  title: string = "Sale History";
  searchKeyword: string = '';
  pageIndex: number = 1;
  pageSize: number = 10;
  consumerId: number = 0;

  constructor(private datePipe: DatePipe, private saleProductService: SaleProductService, private notification: NotificationService,
    public router: Router) {
    this.consumerId = window.history.state?.consumerId;
  }

  ngOnInit(): void {
    if (this.consumerId > 0) {
      this.getAllSellProductsByConsumerId();
    }
    else {
      this.getSaleProducts();
    }
  }

  getSaleProducts() {
    this.saleProductService.getAllSellProducts(this.searchKeyword, this.pageIndex, this.pageSize)
      .subscribe((data: any) => {
        if (data && data.items.length == 0) {
          this.isAvaileble = false;
        }
        this.paginatedItems = data;
      },
        error => {
          this.isAvaileble = false;
          return this.notification.errorMessage(error);
        });
  }

  getAllSellProductsByConsumerId() {
    this.saleProductService.getAllSellProductsByConsumerId(this.consumerId, this.pageIndex, this.pageSize)
      .subscribe((data: any) => {
        if (data && data.items.length == 0) {
          this.isAvaileble = false;
        }
        this.paginatedItems = data;
      },
        error => {
          this.isAvaileble = false;
          return this.notification.errorMessage(error);
        });
  }

  getSaleItemHistory(item) {
    this.router.navigate(['/service/sell-item-history'], {
      state: { saleProductItem: item }
    });
  }

  getSaleProductItems(action, item) {
    this.saleProductService.getSaleProductItems(item.id, this.pageIndex, this.pageSize)
      .subscribe((data: any) => {
        if (data && data.items.length == 0) {
          this.isAvaileble = false;
        }

        data.items.forEach(element => {
          element["name"] = element.product.name;
          element["code"] = element.product.code;
          element["taxAmount"] = ((parseFloat(element.sellPrice) * parseInt(element.unit)) * (parseFloat(element.taxRateInPercentage) / 100)).toFixed(2);
          element["discountPrice"] = ((parseFloat(element.sellPrice) * parseInt(element.unit)) * (parseFloat(element.discountInPercntage) / 100)).toFixed(2);
        });

        this.saleProductService.generateInvoice(action, data.items, item.totalPrice, item.id, item.consumer, this.datePipe.transform(item.createdDate, "dd-MMM-yyyy"));
      },
        error => {
          this.isAvaileble = false;
          return this.notification.errorMessage(error);
        });
  }

  downloadInvoice(item) {
    this.getSaleProductItems('download', item);
  }

  printInvoice(item) {
    this.getSaleProductItems('print', item);
  }

  prev() {
    if (!this.paginatedItems.hasPreviousPage)
      return;

    this.pageIndex = this.pageIndex - 1;
    this.getSaleProducts();
  }
  next() {
    if (!this.paginatedItems.hasNextPage)
      return;

    this.pageIndex = this.pageIndex + 1;
    this.getSaleProducts();
  }
}
