import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { first } from 'rxjs/operators';
import { UserService } from '../_services/user.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  registrationForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  doLoginUser(username: string, password: string) {
    this.authenticationService.login(username, password)
      .pipe(first())
      .subscribe(
        () => {},
        error => {
          this.error = error;
          this.loading = false;
        });
  }

  waitForLogin() {
    this.subscription = this.authenticationService.currentUser.subscribe(x => {
      this.router.navigate(['/']);
    });
  }

  onLoginSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.doLoginUser(this.f.username.value, this.f.password.value);
    this.waitForLogin();
  }

  onRegistrationSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registrationForm.invalid) {
      return;
    }
    let user = this.registrationForm.value as User;
    this.loading = true;

    this.userService.registerUser(user).subscribe(x => {
      this.doLoginUser(user.username, user.password);
    });

    this.waitForLogin();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
