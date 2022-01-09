import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  menus = [{
    name: 'New payment',
    icon: 'add',
    link: 'new-payment'
  }, {
    name: 'Groups',
    icon: 'groups',
    link: 'groups'
  }, {
    name: 'History',
    icon: 'history',
    link: 'history'
  }];

  constructor() {
  }

  ngOnInit(): void {
  }

}
