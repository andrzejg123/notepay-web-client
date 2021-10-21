import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from './_models/user';
import { AuthenticationService } from './_services/authentication.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  currentUser: User;
  private userSubscription: Subscription

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router) {
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.userSubscription = this.authenticationService.currentUser.subscribe(x => {
      this.currentUser = x;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}
