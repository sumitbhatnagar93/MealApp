import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  bgImage =  './assets/images/bgblack.png';
  logo =  './assets/images/logo.png';
  constructor() { }

  ngOnInit() {
  }

}
