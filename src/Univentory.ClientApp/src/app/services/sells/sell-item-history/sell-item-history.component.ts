import { Component, OnInit } from '@angular/core';
import { SaleProductService } from '../sell-product.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sell-item-history',
  templateUrl: './sell-item-history.component.html',
  styleUrls: ['./sell-item-history.component.scss'],
  providers: [DatePipe]
})
export class SellItemHistoryComponent implements OnInit {
  isAvaileble: boolean = true;
  title: string = "Sale Product History";
  searchKeyword: string = '';
  saleProductItem: any;
  saleProduct: any = [];
  paginatedItems = {
    items: [],
    TotalCount: 0,
    TotalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false
  };
  pageIndex: number = 1;
  pageSize: number = 10;

  constructor(private datePipe: DatePipe, private saleProductService: SaleProductService, private notification: NotificationService,
    public router: Router) {
    this.saleProductItem = window.history.state?.saleProductItem;
  }

  ngOnInit(): void {
    this.getSaleProductItems();
  }

  getSaleProductItems() {
    this.saleProductService.getSaleProductItems(this.saleProductItem.id, this.pageIndex, this.pageSize)
      .subscribe((data: any) => {
        if (data && data.items.length == 0) {
          this.isAvaileble = false;
        }
        this.paginatedItems = data;

        this.paginatedItems.items.forEach(element => {
          element["totalAmount"] = this.calculateItemTotalAmount(element);
        });
      },
        error => {
          this.isAvaileble = false;
          return this.notification.errorMessage(error);
        });
  }

  calculateItemTotalAmount(item) {

    item.totalAmount = parseFloat(item.sellPrice) * parseInt(item.unit);

    if (parseFloat(item.discountInPercntage) > 0) {
      item.discountPrice = (parseFloat(item.totalAmount) * (parseFloat(item.discountInPercntage) / 100)).toFixed(2);
      item.totalAmount = (parseFloat(item.totalAmount) - parseFloat(item.discountPrice)).toFixed(2);
    }
    if (parseFloat(item.taxRateInPercentage) > 0) {
      item.taxAmount = ((parseFloat(item.totalAmount)) * (parseFloat(item.taxRateInPercentage) / 100)).toFixed(2);
      item.totalAmount = (parseFloat(item.totalAmount) + parseFloat(item.taxAmount)).toFixed(2);
    }

    return item.totalAmount;
  }

  proceedToGenerateInvoice(action) {
    this.paginatedItems.items.forEach(element => {
      element["name"] = element.product.name;
      element["code"] = element.product.code;
      element["taxAmount"] = ((parseFloat(element.sellPrice) * parseInt(element.unit)) * (parseFloat(element.taxRateInPercentage) / 100)).toFixed(2);
      element["discountPrice"] = ((parseFloat(element.sellPrice) * parseInt(element.unit)) * (parseFloat(element.discountInPercntage) / 100)).toFixed(2);
    });

    this.saleProductService.generateInvoice(action, this.paginatedItems.items, this.saleProductItem.totalPrice, this.saleProductItem.id, this.saleProductItem.consumer, this.datePipe.transform(this.saleProductItem.createdDate, "dd-MMM-yyyy"));
  }

  prev() {
    if (!this.paginatedItems.hasPreviousPage)
      return;

    this.pageIndex = this.pageIndex - 1;
    this.getSaleProductItems();
  }
  next() {
    if (!this.paginatedItems.hasNextPage)
      return;

    this.pageIndex = this.pageIndex + 1;
    this.getSaleProductItems();
  }
}
