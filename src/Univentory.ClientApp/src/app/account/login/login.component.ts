import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/authentication/auth.service';
import { ConfigService } from '../../shared/services/config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  returnUrl: string;
  loading = false;
  submitted: boolean = false;

  constructor(private authService: AuthService, private configService: ConfigService, private route: ActivatedRoute,
    private router: Router, private formBuilder: FormBuilder, private notification: NotificationService) {

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/service']);
    }
    else {
      // reset login status
      this.authService.signout();
      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/service';
    }

  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.loginForm.controls; }

  onLoginSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.value)
      .subscribe((data: any) => {
        if (!data) {
          this.loading = false;
          return this.notification.errorMessage("Something went wrong. Please try again");
        }
        this.authService.completeAuthentication(data);
        this.router.navigate([this.returnUrl]);
      },
        error => {
          this.loading = false;
          return this.notification.errorMessage(error);
        });
  }
}


