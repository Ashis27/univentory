import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ConsumerService } from '../consumers/consumer.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AuthService } from 'src/app/shared/authentication/auth.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.sass']
})
export class UserprofileComponent implements OnInit {
  title: string = 'Edit Profile';
  editUser: FormGroup;
  submitted: boolean = false;
  consumerData: any;
  editConsumer: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, public router: Router,
    private consumerService: ConsumerService, private notification: NotificationService) {

  }

  ngOnInit(): void {
    this.editUser = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      userName: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      shopName: ['', Validators.required],
      email: [''],
      gstNumber:['',Validators.required],
      address: [''],
      passwordHash: [''],
      isActive: [true]
    });

    this.getUserProfile();
  }

  get f() { return this.editUser.controls; }

  getUserProfile() {
    this.consumerService.getUserProfile()
      .subscribe((data: any) => {
        this.initialize(data);
      },
        error => {
          return this.notification.errorMessage(error);
        })
  }

  update(): void {
    this.submitted = true;
    this.f.mobileNumber.setValue(this.f.mobileNumber.value.toString());

    if (this.editUser.invalid) {
      return;
    }

    this.consumerService.updateUserProfile(this.editUser.value)
      .subscribe((data: any) => {
        return this.notification.successMessage("Successfully updated");
      },
        error => {
          return this.notification.errorMessage(error);
        });
  }

  initialize(consumerData: any): void {
    if (consumerData) {
      (<FormControl>this.f['id']).setValue(consumerData.id);
      (<FormControl>this.f['name']).setValue(consumerData.name);
      (<FormControl>this.f['userName']).setValue(consumerData.userName);
      (<FormControl>this.f['shopName']).setValue(consumerData.shopName);
      (<FormControl>this.f['email']).setValue(consumerData.email);
      (<FormControl>this.f['mobileNumber']).setValue(consumerData.mobileNumber);
      (<FormControl>this.f['address']).setValue(consumerData.address);
      (<FormControl>this.f['gstNumber']).setValue(consumerData.gstNumber);
      (<FormControl>this.f['passwordHash']).setValue(consumerData.passwordHash);
    }
  }

  cancel(): void {
    this.router.navigate(['/service']);
  }

}
