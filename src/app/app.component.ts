import { Component, OnInit } from '@angular/core';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { Data, Router } from '@angular/router';
import { HeaderService } from './header/header.service';
import { fetchUserAttributes } from 'aws-amplify/auth';

Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: '../styles.css',
})
export class AppComponent implements OnInit {
  public formFields = {
    signUp: {
      preferred_username: {
        order: 1,
        label: 'Preferred Username',
        placeholder: 'Enter your preferred username'
      }
    }
  }
  header: any;
  priceToggle: any;
  user: any;
  displayName: any;

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
    fetchUserAttributes().then(user => {
      this.user = user;
      this.displayName = user.preferred_username;
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

