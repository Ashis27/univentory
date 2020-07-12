import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { VendorService } from '../vendor.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.sass']
})
export class EditVendorComponent implements OnInit {

  title: string = 'Update Vendor';
  editVendor: FormGroup;
  submitted: boolean = false;
  vendorData:any;
  // @ViewChild('alertConfirmationModal') alertModelPopUp: AlertmodalpopupComponent;

  constructor(private formBuilder: FormBuilder, public router: Router, 
    private vendorService: VendorService, private notification: NotificationService) { 
      this.vendorData = window.history.state?.vendorData;
    }

  ngOnInit(): void {
    this.editVendor = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      email: [''],
      mobileNumber: [''],
      billingAddress: [''],
      isActive: [true]
    });

    this.initialize(this.vendorData);
  }

  get f() { return this.editVendor.controls; }

  initialize(vendorData: any): void {
    if (vendorData) {
      (<FormControl>this.f['id']).setValue(vendorData.id);
      (<FormControl>this.f['name']).setValue(vendorData.name);
      (<FormControl>this.f['email']).setValue(vendorData.email);
      (<FormControl>this.f['mobileNumber']).setValue(vendorData.mobileNumber);
      (<FormControl>this.f['billingAddress']).setValue(vendorData.billingAddress);
    }
  }
  
  update(): void {
    this.submitted = true;
    this.f.mobileNumber.setValue(this.f.mobileNumber.value.toString());

    if (this.editVendor.invalid) {
      return;
    }

    this.vendorService.updateVendor(this.editVendor.value)
      .subscribe((data: any) => {
        this.cancel();
        return this.notification.successMessage("Successfully updated");
      },
        error => {
          return this.notification.errorMessage(error);
        });
  }

  cancel(): void {
    this.router.navigate(['/service/vendors']);
  }
}
