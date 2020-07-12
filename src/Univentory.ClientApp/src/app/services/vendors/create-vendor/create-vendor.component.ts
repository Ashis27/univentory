import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertmodalpopupComponent } from 'src/app/shared/component/alertmodalpopup/alertmodalpopup.component';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { VendorService } from '../vendor.service';

@Component({
  selector: 'app-create-vendor',
  templateUrl: './create-vendor.component.html',
  styleUrls: ['./create-vendor.component.sass']
})
export class CreateVendorComponent implements OnInit {
  title: string = 'Create Vendor';
  createVendor: FormGroup;
  submitted: boolean = false;
  // @ViewChild('alertConfirmationModal') alertModelPopUp: AlertmodalpopupComponent;

  constructor(private formBuilder: FormBuilder, public router: Router, private vendorService: VendorService, private notification: NotificationService) { }

  ngOnInit(): void {
    this.createVendor = this.formBuilder.group({
      name: ['', Validators.required],
      email: [''],
      mobileNumber: [''],
      billingAddress: [''],
      isActive: [true]
    });
  }

  get f() { return this.createVendor.controls; }

  save(): void {
    this.submitted = true;
    this.f.mobileNumber.setValue(this.f.mobileNumber.value.toString());

    if (this.createVendor.invalid) {
      return;
    }

    this.vendorService.addVendor(this.createVendor.value)
      .subscribe((data: any) => {
        this.ngOnInit();
        return this.notification.successMessage("Successfully created");
      },
        error => {
          return this.notification.errorMessage(error);
        });
  }

  cancel(): void {
    this.router.navigate(['/service/vendors']);
  }
}
