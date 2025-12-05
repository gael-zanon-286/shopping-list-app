import { Component, OnInit } from '@angular/core';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { Router } from '@angular/router';
import { HeaderService } from './services/header.service';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { TranslateService } from "@ngx-translate/core";
import { settings } from 'ionicons/icons';
import { ListStoreService } from './services/list-store.service';
import { ListService } from './services/list.service';
import { Schema } from 'inspector/promises';

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
        label: 'Username',
        placeholder: 'Enter your username'
      }
    }
  }
  options = settings;
  header: any;
  priceToggle: any;
  user: any;
  displayName: any;

  constructor(private translate: TranslateService, public authenticator: AuthenticatorService, public router: Router, private headerService: HeaderService, private storeService: ListStoreService, private listService: ListService) {
    Amplify.configure(outputs);
  }
  ngOnInit() {
    this.headerService.message$.subscribe(value => {
      this.header = value;
    });
    fetchUserAttributes().then(user => {
      this.user = user;
      this.displayName = user.preferred_username;
    });
    this.initTranslate();
  }

  // Navigate to new route
  go(url: string) {
    this.router.navigateByUrl(url);

    // Update header title
    if (url == 'my-lists') {
      this.header = this.translate.instant('menu.myLists');
    } else if (url == 'historic-lists') {
      this.header = this.translate.instant('menu.historicLists');
    }
  }

  // Change language
  public changeLanguage(language: string) {
    this.translate.use(language);
    this.header = this.translate.instant('menu.myLists');
  }

  // Set up translation
  initTranslate() {
    this.translate.setFallbackLang('en');

    if (this.translate.getBrowserLang() !== undefined) {
        this.translate.use(this.translate.getBrowserLang()!);
    } else {
        this.translate.use('en');
    }
  }

  // Delete list from options menu
  async deleteList() {
    const list = this.storeService.list;
    if (list) {
      await this.listService.deleteList(list);
    }
    this.storeService.list = null;
    await this.router.navigateByUrl('historic-lists');
  }

  // Add friend from options menu
  addFriend() {
    this.headerService.addFriend()
  }

  // Delete striked on current list from options menu
  deleteStriked() {
    this.headerService.deleteStriked();
  }
}

