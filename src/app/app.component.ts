import { Component } from '@angular/core';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { Router } from '@angular/router';

Amplify.configure(outputs);


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'amplify-angular-template';

  constructor(public authenticator: AuthenticatorService, private router: Router) {
    Amplify.configure(outputs);
  }

  go(url: string) {
    this.router.navigateByUrl(url);
  }
}
