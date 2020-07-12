
import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router } from '@angular/router';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { ConsumerService } from '../consumers/consumer.service';
import { AlertmodalpopupComponent } from 'src/app/shared/component/alertmodalpopup/alertmodalpopup.component';
import { ProductService } from '../products/product.service';
import { ISearchParams } from 'src/app/shared/services/interfaces/ISearchParams';
import { SaleProductService } from './sell-product.service';
import { AuthService } from 'src/app/shared/authentication/auth.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-sells',
  templateUrl: './sells.component.html',
  styleUrls: ['./sells.component.scss'],
  providers: [DatePipe]
})
export class SellsComponent implements OnInit {
  title: string = 'Sale';
  sellProduct: FormGroup;
  submitted: boolean = false;
  searchConsumer: string = '';
  isNewConsumer: boolean = false;
  pageIndex: number = 1;
  pageSize: number = 10;
  consumers: any = { items: [] };
  isSaleCompleted: boolean = false;
  paginatedItems = {
    items: [],
    TotalCount: 0,
    TotalPages: 0,
    HasPreviousPage: false,
    HasNextPage: false
  }
  isAvaileble: boolean = true;
  selectedConsumerInfo: any;
  totalPaid: number;
  totalPrice: string;
  sellItems: any = [];
  product: any = { items: [] };
  productItem: any = {
    productId: 0,
    name: "",
    code: "",
    unit: '',
    sellPrice: '',
    taxAmount: '',
    taxRateInPercentage: '',
    discountInPercntage: '',
    discountPrice: '',
    totalAmount: 0
  };
  searchParams: ISearchParams = {
    UserId: 0,
    IsActive: true,
    Keyword: "",
    Name: "",
    Code: "",
    PageIndex: 1,
    PageSize: 10
  };

  productItemsToSell: any = {
    totalPaid: 0,
    totalPrice: 0,
    consumerId: 0,
    sellHistory: []
  };
  currentDate: Date;
  selectedConsumer: any;
  invoiceNumber: number;

  @ViewChild('alertConfirmationModal') alertModelPopUp: AlertmodalpopupComponent;

  constructor(private datePipe: DatePipe, private formBuilder: FormBuilder, private authService: AuthService, private consumerService: ConsumerService,
    public router: Router, private notification: NotificationService, private productService: ProductService,
    private saleProductService: SaleProductService) {
    this.isSaleCompleted = false;
  }

  ngOnInit(): void {
    this.sellProduct = this.formBuilder.group({
      consumer: ['', Validators.required],
      consumerId: [''],
      name: [''],
      code: [''],
      unit: [''],
      sellPrice: [''],
      taxAmount: [''],
      taxRateInPercentage: [''],
      discountInPercntage: [''],
      discountPrice: [''],
      totalAmount: [''],
      totalPaid: [''],
      totalPrice: [''],
      sellHistory: [[]],
      isActive: [true]
    });

    this.sellItems.push(this.productItem);
    this.currentDate = new Date();
    this.getConsumers();
    this.getProductItems('');
  }

  get f() { return this.sellProduct.controls; }

  consumerOnSelect(e: TypeaheadMatch) {
    this.selectedConsumer = e.item;
    this.f.consumerId.setValue(e.item.id);
  }

  removeItem(index) {
    this.sellItems.splice(index, 1);
  }

  addItem() {
    this.productItem = {};
    this.sellItems.push(this.productItem);
  }

  getProductItems(value) {
    this.searchParams.Keyword = value;
    this.productService.getProducts(this.searchParams)
      .subscribe((data: any) => {
        if (data.items.length == 0) {
          this.isAvaileble = false;
        }
        this.product = data;
      },
        error => {
          this.isAvaileble = false;
          return this.notification.errorMessage(error);
        });
  }

  productOnSelect(e: TypeaheadMatch, item) {
    item.productId = e.item.id;
    item.unit = 1;
    item.sellPrice = parseFloat(e.item.sellPrice);
    item.code = e.item.code;
    item.discountInPercntage = parseFloat(e.item.discountInPercntage);
    item.taxRateInPercentage = parseFloat(e.item.taxRateInPercentage);
    this.calculateItemTotalAmount(item);
  }

  calculateItemTotalAmount(item) {
    item.taxAmount = '';

    if (parseInt(item.unit) <= 0) {
      item.unit = '';
      item.totalAmount = 0;
      return this.notification.errorMessage("Please enter a valid unit");
    }

    if (parseFloat(item.sellPrice) > 0) {
      item.totalAmount = parseFloat(item.sellPrice) * parseInt(item.unit);
    }
    else {
      item.sellPrice = '';
      item.totalAmount = 0;
    }

    if (parseFloat(item.discountInPercntage) > 0) {
      if (parseFloat(item.discountInPercntage) > 100 || parseFloat(item.discountInPercntage) < 0) {
        item.discountInPercntage = '';
        item.discountPrice = '';
        return this.notification.errorMessage("Discount percentage must be in between 0-100");
      }

      item.discountPrice = (parseFloat(item.totalAmount) * (parseFloat(item.discountInPercntage) / 100)).toFixed(2);
      item.totalAmount = (parseFloat(item.totalAmount) - parseFloat(item.discountPrice)).toFixed(2);
    }
    else {
      item.discountInPercntage = '';
      item.discountPrice = '';
    }

    if (parseFloat(item.taxRateInPercentage) > 0) {
      if (parseFloat(item.taxRateInPercentage) > 28 || parseFloat(item.discountInPercntage) < 0) {
        item.taxRateInPercentage = '';
        item.taxAmount = '';
        return this.notification.errorMessage("Tax(GST) percentage must be in between 0-28");
      }

      item.taxAmount = ((parseFloat(item.totalAmount)) * (parseFloat(item.taxRateInPercentage) / 100)).toFixed(2);
      item.totalAmount = (parseFloat(item.totalAmount) + parseFloat(item.taxAmount)).toFixed(2);
    }
    else {
      item.taxRateInPercentage = '';
      item.taxAmount = '';
    }
    this.calculateTotalAmoiunt();
  }

  calculateItemTotalAmountByDiscountPrice(item) {
    item.taxAmount = '';

    if (parseInt(item.unit) <= 0) {
      item.unit = '';
      item.totalAmount = 0;
      return this.notification.errorMessage("Please enter a valid unit");
    }

    if (parseFloat(item.sellPrice) > 0) {
      item.totalAmount = parseFloat(item.sellPrice) * parseInt(item.unit);
    }
    else {
      item.sellPrice = '';
      item.totalAmount = 0;
    }

    if (parseFloat(item.discountPrice) > 0) {
      item.discountInPercntage = (100 - (((parseFloat(item.totalAmount) - parseFloat(item.discountPrice)) / parseFloat(item.totalAmount)) * 100)).toFixed(2);
      if (parseFloat(item.discountInPercntage) > 100 || parseFloat(item.discountInPercntage) < 0) {
        item.discountInPercntage = '';
        item.discountPrice = '';
        return this.notification.errorMessage("Discount percentage must be in between 0-100");
      }
      item.totalAmount = parseFloat(item.totalAmount) - parseFloat(item.discountPrice);
    }
    else {
      item.discountInPercntage = '';
      item.discountPrice = '';
    }

    if (parseFloat(item.taxRateInPercentage) > 0) {
      if (parseFloat(item.taxRateInPercentage) > 28 || parseFloat(item.discountInPercntage) < 0) {
        item.taxRateInPercentage = '';
        item.taxAmount = '';
        return this.notification.errorMessage("Tax (GST) percentage must be in between 0-28");
      }
      item.taxAmount = ((parseFloat(item.totalAmount)) * (parseFloat(item.taxRateInPercentage) / 100)).toFixed(2);
      item.totalAmount = (parseFloat(item.totalAmount) + parseFloat(item.taxAmount)).toFixed(2);
    }
    else {
      item.taxRateInPercentage = '';
      item.taxAmount = '';
    }

    this.calculateTotalAmoiunt();
  }

  calculateTotalAmoiunt() {
    this.totalPrice = '0';
    if (this.sellItems.length > 0) {
      this.sellItems.forEach(element => {
        this.totalPrice = (parseFloat(this.totalPrice) + parseFloat(element.totalAmount)).toFixed(2);
      });
    }
  }
  getConsumers() {
    this.consumerService.getConsumers(this.searchConsumer, this.pageIndex, this.pageSize)
      .subscribe((data: any) => {
        if (data && data.items.length == 0) {
          this.isNewConsumer = true;
        }
        this.consumers = data;
      },
        error => {
          this.isNewConsumer = false;
          return this.notification.errorMessage(error);
        });
  }


  addNewConsumer() {
    this.selectedConsumerInfo = {
      "Name": this.searchConsumer
    };
    this.alertModelPopUp.show(this.searchConsumer, 'consumer');
  }

  action() {
    this.consumerService.addConsumer(this.selectedConsumerInfo)
      .subscribe((data: any) => {
        this.isNewConsumer = false;
        this.searchConsumer = data.name;
        this.f.consumerId.setValue(data.id);
      },
        error => {
          return this.notification.errorMessage(error);
        });
  }

  save(): void {
    this.submitted = true;
    let isValidItems = false;
    this.isSaleCompleted = false;

    if (this.f.consumerId.value == '' || this.f.consumerId.value == undefined || this.isNewConsumer) {
      return this.notification.errorMessage("You have not selected any consumer. Please select");
    }

    if (this.sellItems.length == 0) {
      return this.notification.errorMessage("No product item has been added to sale.");
    }

    let item = this.sellItems.filter(item => {
      item.discountInPercntage = (item.discountInPercntage != '' && item.discountInPercntage != undefined) ? parseFloat(item.discountInPercntage) : 0;
      item.taxRateInPercentage = (item.taxRateInPercentage != '' && item.taxRateInPercentage != undefined) ? parseFloat(item.taxRateInPercentage) : 0
      return parseInt(item.unit) == 0 || item.unit == null || item.unit == undefined || item.code == '' || item.code == undefined;
    })

    if (item && item.length > 0) {
      return this.notification.errorMessage("Please enter a valid product item with valid unit");
    }

    this.productItemsToSell = {
      totalPrice: parseFloat(this.totalPrice),
      totalPaid: this.totalPaid,
      consumerId: this.f.consumerId.value,
      sellHistory: this.sellItems
    };

    this.saleProductService.saleProductItems(this.productItemsToSell)
      .subscribe((data: any) => {
        // this.router.navigate(['/service/sell-history']);
        this.invoiceNumber = data;
        this.isSaleCompleted = true;
        this.generateInvoice();
      },
        error => {
          this.isSaleCompleted = false;
          return this.notification.errorMessage(error);
        });
  }

  generateInvoice(action = 'print') {
    this.saleProductService.generateInvoice(action,this.sellItems,this.productItemsToSell.totalPrice,this.invoiceNumber,this.selectedConsumer,this.datePipe.transform(this.currentDate, "dd-MMM-yyyy"));
  }


  cancel(): void {
    this.router.navigate(['/service/sell-history']);
  }
}
