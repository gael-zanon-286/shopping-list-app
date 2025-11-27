import { Component, OnInit } from '@angular/core';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { Data, Router } from '@angular/router';
import { HeaderService } from './header/header.service';

Amplify.configure(outputs);


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'amplify-angular-template';
  header: any;
  priceToggle: any;

  constructor(public authenticator: AuthenticatorService, public router: Router, private headerService: HeaderService) {
    Amplify.configure(outputs);
  }
  ngOnInit(): void {
    if (this.priceToggle == undefined) {
      this.header = 'My Lists';
      this.priceToggle = false;
    }
    this.headerService.message$.subscribe(value => {
      this.header = value;
    });
  }

  go(url: string) {
    this.router.navigateByUrl(url);
    this.header = 'My Lists';
  }

  toggle() {
    this.priceToggle = !this.priceToggle;
    this.headerService.sendToggle(this.priceToggle);
  }
}

