import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { AlertmodalpopupComponent } from 'src/app/shared/component/alertmodalpopup/alertmodalpopup.component';
import { ProductService } from '../product.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.sass'],
  providers: []
})
export class CreateProductComponent implements OnInit {
  title: string = 'Create Product';
  createProduct: FormGroup;
  submitted: boolean = false;
  typeaheadNoResults: boolean;
  isNewCategory: boolean = false;
  isNewBrand: boolean = false;
  isNewVendor: boolean = false;
  selectedType: string = '';
  categories: any = { items: [] };
  brands: any = { items: [] };
  vendors: any = { items: [] };
  selectedCategoryInfo: any;
  selectedBrandInfo: any;
  selectedVendorInfo: any;
  pageIndex: number = 1;
  pageSize: number = 10;
  category: string = '';
  brand: string = '';
  vendor: string = '';
  @ViewChild('alertConfirmationModal') alertModelPopUp: AlertmodalpopupComponent;

  constructor(private formBuilder: FormBuilder,public router: Router, private productService: ProductService, private notification: NotificationService) { }

  ngOnInit(): void {
    this.createProduct = this.formBuilder.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      purchasePrice: [null, [Validators.required, Validators.pattern(/^\d*(?:[.,]\d{1,2})?$/)]],
      sellPrice: [null, [Validators.required, Validators.pattern(/^\d*(?:[.,]\d{1,2})?$/)]],
      taxRateInPercentage: [null, [Validators.required, Validators.pattern(/^\d*(?:[.,]\d{1,2})?$/)]],
      availableStock: [null, [Validators.required, Validators.pattern("^[0-9]*$")]],
      categoryId: [''],
      brandId: [''],
      vendorId: [''],
      categoryIdBackUp: ['', Validators.required],
      brandIdBackUp: ['', Validators.required],
      vendorIdBackUp: ['', Validators.required],
      discountInPercntage: [null],
      description: [''],
      isActive: [true]
    });
    this.getCategories();
    this.getBrands();
    this.getVendors()
  }

  get f() { return this.createProduct.controls; }

  save(): void {
    this.submitted = true;

    if (this.createProduct.invalid) {
      return;
    }

    if (this.f.categoryId.value == '' || this.f.categoryId.value == undefined || this.isNewCategory) {
      return this.notification.errorMessage("Selected category is not available ");
    }

    if (this.f.brandId.value == '' || this.f.brandId.value == undefined || this.isNewBrand) {
      return this.notification.errorMessage("Selected brand is not available");
    }

    if (this.f.vendorId.value == '' || this.f.vendorId.value == undefined || this.isNewBrand) {
      return this.notification.errorMessage("Selected vendor is not available");
    }

    if (this.f.discountInPercntage.value == null || this.f.discountInPercntage.value == undefined || this.f.discountInPercntage.value == '') {
      this.f.discountInPercntage.setValue(0);
    }

    this.productService.addProduct(this.createProduct.value)
      .subscribe((data: any) => {
        // this.ngOnInit();
        this.router.navigate(['/service/products']);
        return this.notification.successMessage("Successfully added product");
      },
        error => {
          return this.notification.errorMessage(error);
        });
  }

  categoryOnSelect(e: TypeaheadMatch) {
    this.f.categoryId.setValue(e.item.id);
  }

  brandOnSelect(e: TypeaheadMatch) {
    this.f.brandId.setValue(e.item.id);
  }

  vendorOnSelect(e: TypeaheadMatch) {
    this.f.vendorId.setValue(e.item.id);
  }

  changeTypeaheadNoResults(event) {
    // if (event) {
    //   this.isNewCategory = true;
    // }
    // else {
    //   this.isNewCategory = false;
    // }
  }

  addNewCategory() {
    this.selectedType = 'category';
    this.selectedCategoryInfo = {
      "Name": this.category
    };
    this.alertModelPopUp.show(this.category, this.selectedType);
  }

  addNewBrand() {
    this.selectedBrandInfo = {
      "Name": this.brand
    };
    this.selectedType = 'brand';
    this.alertModelPopUp.show(this.brand, this.selectedType);
  }

  addNewVendor() {
    this.selectedVendorInfo = {
      "Name": this.vendor,
      "MobileNumber": "7008693982"
    };
    this.selectedType = 'vendor';
    this.alertModelPopUp.show(this.vendor, this.selectedType);
  }

  getCategories() {
    this.productService.getCategories(this.category, this.pageIndex, this.pageSize)
      .subscribe((data: any) => {
        if (data && data.items.length > 0) {
          this.isNewCategory = false;
        }
        else {
          this.isNewCategory = true;
        }

        this.categories = data;
      },
        error => {
          return this.notification.errorMessage(error);
        });
  }

  getVendors() {
    this.productService.getVendors(this.vendor, this.pageIndex, this.pageSize)
      .subscribe((data: any) => {
        if (data && data.items.length > 0) {
          this.isNewVendor = false;
        }
        else {
          this.isNewVendor = true;
        }

        this.vendors = data;
      },
        error => {
          return this.notification.errorMessage(error);
        });
  }

  getBrands() {
    this.productService.getBrands(this.brand, this.pageIndex, this.pageSize)
      .subscribe((data: any) => {
        if (data && data.items.length > 0) {
          this.isNewBrand = false;
        }
        else {
          this.isNewBrand = true;
        }

        this.brands = data;
      },
        error => {
          return this.notification.errorMessage(error);
        });
  }


  action() {
    if (this.selectedType == 'category') {
      this.productService.addCategory(this.selectedCategoryInfo)
        .subscribe((data: any) => {
          this.isNewCategory = false;
          this.category = data.name;
          this.f.categoryId.setValue(data.id);
        },
          error => {
            return this.notification.errorMessage(error);
          });
    }
    else if (this.selectedType == 'brand') {
      this.productService.addBrand(this.selectedBrandInfo)
        .subscribe((data: any) => {
          this.isNewBrand = false;
          this.brand = data.name;
          this.f.brandId.setValue(data.id);
        },
          error => {
            return this.notification.errorMessage(error);
          });
    }
    else {
      this.productService.addVendor(this.selectedVendorInfo)
        .subscribe((data: any) => {
          this.isNewVendor = false;
          this.vendor = data.name;
          this.f.vendorId.setValue(data.id);
        },
          error => {
            return this.notification.errorMessage(error);
          });
    }
  }

  cancel(): void {
    this.router.navigate(['/service/products']);
  }
}
