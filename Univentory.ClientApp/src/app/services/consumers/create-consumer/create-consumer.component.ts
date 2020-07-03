import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertmodalpopupComponent } from 'src/app/shared/component/alertmodalpopup/alertmodalpopup.component';
import { Router } from '@angular/router';
import { ConsumerService } from '../consumer.service';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-create-consumer',
  templateUrl: './create-consumer.component.html',
  styleUrls: ['./create-consumer.component.sass']
})
export class CreateConsumerComponent implements OnInit {
  title: string = 'Create Consumer';
  createConsumer: FormGroup;
  submitted: boolean = false;
  // @ViewChild('alertConfirmationModal') alertModelPopUp: AlertmodalpopupComponent;

  constructor(private formBuilder: FormBuilder, public router: Router, private consumerService: ConsumerService, private notification: NotificationService) { }

  ngOnInit(): void {
    this.createConsumer = this.formBuilder.group({
      name: ['', Validators.required],
      email: [''],
      mobileNumber: [''],
      billingAddress: [''],
      isActive: [true]
    });
  }

  get f() { return this.createConsumer.controls; }

  save(): void {
    this.submitted = true;
    this.f.mobileNumber.setValue(this.f.mobileNumber.value.toString());
    
    if (this.createConsumer.invalid) {
      return;
    }

    this.consumerService.addConsumer(this.createConsumer.value)
      .subscribe((data: any) => {
        this.ngOnInit();
        return this.notification.successMessage("Successfully created");
      },
        error => {
          return this.notification.errorMessage(error);
        });
  }

  cancel(): void {
    this.router.navigate(['/service/consumers']);
  }

}
