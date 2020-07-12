import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { VendorService } from '../../vendors/vendor.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ConsumerService } from '../consumer.service';

@Component({
  selector: 'app-edit-consumer',
  templateUrl: './edit-consumer.component.html',
  styleUrls: ['./edit-consumer.component.sass']
})
export class EditConsumerComponent implements OnInit {

  title: string = 'Update Consumer';
  editConsumer: FormGroup;
  submitted: boolean = false;
  consumerData:any;
  // @ViewChild('alertConfirmationModal') alertModelPopUp: AlertmodalpopupComponent;

  constructor(private formBuilder: FormBuilder, public router: Router, 
    private consumerService: ConsumerService, private notification: NotificationService) {
      this.consumerData = window.history.state?.consumerData;
     }

  ngOnInit(): void {
    this.editConsumer = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      email: [''],
      mobileNumber: [''],
      billingAddress: [''],
      isActive: [true]
    });

    this.initialize(this.consumerData);
  }

  get f() { return this.editConsumer.controls; }

  initialize(consumerData: any): void {
    if (consumerData) {
      (<FormControl>this.f['id']).setValue(consumerData.id);
      (<FormControl>this.f['name']).setValue(consumerData.name);
      (<FormControl>this.f['email']).setValue(consumerData.email);
      (<FormControl>this.f['mobileNumber']).setValue(consumerData.mobileNumber);
      (<FormControl>this.f['billingAddress']).setValue(consumerData.billingAddress);
    }
  }
  update(): void {
    this.submitted = true;
    this.f.mobileNumber.setValue(this.f.mobileNumber.value.toString());

    if (this.editConsumer.invalid) {
      return;
    }

    this.consumerService.updateConsumer(this.editConsumer.value)
      .subscribe((data: any) => {
        this.cancel();
        return this.notification.successMessage("Successfully updated");
      },
        error => {
          return this.notification.errorMessage(error);
        });
  }

  cancel(): void {
    this.router.navigate(['/service/consumers']);
  }
}
