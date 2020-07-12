import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ServicesRoutingModule } from './services-routing.module';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminLayoutComponent } from './adminlayout.component';
import { SidebarComponent } from './sidenav/sidenav.component';
import { ProductsComponent } from './products/products.component';
import { ReportComponent } from './report/report.component';
import { ConsumersComponent } from './consumers/consumers.component';
import { VendorsComponent } from './vendors/vendors.component';
import { SellsComponent } from './sells/sells.component';
import { PurchasesComponent } from './purchases/purchases.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { ProductService } from './products/product.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AlertmodalpopupComponent } from '../shared/component/alertmodalpopup/alertmodalpopup.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { VendorService } from './vendors/vendor.service';
import { EditConsumerComponent } from './consumers/edit-consumer/edit-consumer.component';
import { CreateConsumerComponent } from './consumers/create-consumer/create-consumer.component';
import { CreateVendorComponent } from './vendors/create-vendor/create-vendor.component';
import { EditVendorComponent } from './vendors/edit-vendor/edit-vendor.component';
import { ConsumerService } from './consumers/consumer.service';
import { SellHistoryComponent } from './sells/sell-history/sell-history.component';
import { ConsumerHistoryComponent } from './consumers/history/history.component';
import { VendorHistoryComponent } from './vendors/history/history.component';
import { ProductHistoryComponent } from './products/history/history.component';
import { PurchaseHistoryComponent } from './purchases/history/history.component';
import { SaleProductService } from './sells/sell-product.service';
import { SellItemHistoryComponent } from './sells/sell-item-history/sell-item-history.component';

@NgModule({
  declarations: [
    DashboardComponent,
    AdminLayoutComponent,
    SidebarComponent,
    ProductsComponent,
    ReportComponent,
    ConsumersComponent,
    VendorsComponent,
    SellsComponent,
    PurchasesComponent,
    UserprofileComponent,
    CreateProductComponent,
    EditProductComponent,
    AlertmodalpopupComponent,
    EditConsumerComponent,
    CreateConsumerComponent,
    CreateVendorComponent,
    EditVendorComponent,
    ConsumerHistoryComponent,
    SellHistoryComponent,
    VendorHistoryComponent,
    ProductHistoryComponent,
    PurchaseHistoryComponent,
    SellItemHistoryComponent

  ],
  imports: [
    ServicesRoutingModule,
    BsDatepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    ModalModule.forRoot(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    ProductService,
    VendorService,
    ConsumerService,
    SaleProductService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ServicesModule { }
