import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuardService } from '../shared/authentication/auth.guard';
import { AdminLayoutComponent } from './adminlayout.component';
import { ProductsComponent } from './products/products.component';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { ConsumersComponent } from './consumers/consumers.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { VendorsComponent } from './vendors/vendors.component';
import { CreateVendorComponent } from './vendors/create-vendor/create-vendor.component';
import { EditVendorComponent } from './vendors/edit-vendor/edit-vendor.component';
import { EditConsumerComponent } from './consumers/edit-consumer/edit-consumer.component';
import { CreateConsumerComponent } from './consumers/create-consumer/create-consumer.component';
import { ConsumerHistoryComponent } from './consumers/history/history.component';
import { VendorHistoryComponent } from './vendors/history/history.component';
import { ProductHistoryComponent } from './products/history/history.component';
import { SellHistoryComponent } from './sells/sell-history/sell-history.component';
import { PurchasesComponent } from './purchases/purchases.component';
import { SellsComponent } from './sells/sells.component';
import { ReportComponent } from './report/report.component';
import { SellItemHistoryComponent } from './sells/sell-item-history/sell-item-history.component';
import { UserprofileComponent } from './userprofile/userprofile.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'products',
        component: ProductsComponent,
      },
      {
        path: 'create-product',
        component: CreateProductComponent
      },
      {
        path: 'edit-product',
        component: EditProductComponent
      },
      {
        path: 'vendors',
        component: VendorsComponent,
      },
      {
        path: 'sell',
        component: SellsComponent
      },
      {
        path: 'report',
        component: ReportComponent,
      },
      {
        path: 'purchase',
        component: PurchasesComponent,
      },
      {
        path: 'create-vendor',
        component: CreateVendorComponent
      },
      {
        path: 'edit-vendor',
        component: EditVendorComponent
      },
      {
        path: 'consumers',
        component: ConsumersComponent
      },
      {
        path: 'create-consumer',
        component: CreateConsumerComponent
      },
      {
        path: 'edit-consumer',
        component: EditConsumerComponent
      },
      {
        path: 'consumer-history',
        component: ConsumerHistoryComponent
      },
      {
        path: 'vendor-history',
        component: VendorHistoryComponent
      },
      {
        path: 'product-history',
        component: ProductHistoryComponent
      },
      {
        path: 'sell-history',
        component: SellHistoryComponent
      },
      {
        path: 'purchase-history',
        component: PurchasesComponent
      },
      {
        path: 'sell-item-history',
        component: SellItemHistoryComponent
      },
      {
        path: 'user-profile',
        component: UserprofileComponent
      }
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ServicesRoutingModule { }
