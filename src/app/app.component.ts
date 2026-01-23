import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import { AuthenticatorService } from '@aws-amplify/ui-angular';
import { Router, NavigationEnd } from '@angular/router';
import { HeaderService } from './services/header.service';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { TranslateService } from "@ngx-translate/core";
import { ellipsisHorizontal, arrowBackOutline } from 'ionicons/icons';
import { ListStoreService } from './services/list-store.service';
import { ListService } from './services/list.service';
import { Location } from '@angular/common';
import { ReportService } from './services/report.service';

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
  options = ellipsisHorizontal;
  header: any;
  priceToggle: any;
  user: any;
  displayName: any;
  arrowBackOutline = arrowBackOutline;
  showMenuButton: boolean = true;
  translationsReady: boolean = false;

  constructor(
    private translate: TranslateService,
    public authenticator: AuthenticatorService,
    public router: Router,
    private headerService: HeaderService,
    private storeService: ListStoreService,
    private listService: ListService,
    private location: Location,
    private cdr: ChangeDetectorRef,
    private reportService: ReportService) {
    Amplify.configure(outputs);
  }
  ngOnInit() {
    // Switch between menu button or back button
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const menuRoutes = ['/my-lists', '/historic-lists', '/report-list'];
        this.showMenuButton = menuRoutes.includes(event.urlAfterRedirects);
      }
    });

    // Update header title by route
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
    this.updateTitle(url);
  }

  // Change language
  public changeLanguage(language: string) {
    if (language) {
      this.translate.use(language).subscribe(() => {
        this.translationsReady = true;
        this.cdr.markForCheck();
      });
    }
    this.header = this.translate.instant('menu.myLists');
  }

  // Set up translation
  initTranslate() {
    this.translate.setFallbackLang('en');

    if (this.translate.getBrowserLang() !== undefined) {
        this.translate.use(this.translate.getBrowserLang()!).subscribe(() => {
          this.translationsReady = true;
          this.cdr.markForCheck();
        });
    } else {
        this.translate.use('en').subscribe(() => {
          this.translationsReady = true;
          this.cdr.markForCheck();
        });
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

  goBack() {
    this.location.back();
    this.updateTitle(this.router.url.split('/')[1]);
  }

  // Update header title
  updateTitle(url: string) {
    if (url == 'my-lists') {
      this.header = this.translate.instant('menu.myLists');
    } else if (url == 'historic-lists') {
      this.header = this.translate.instant('menu.historicLists');
    } else if (url == 'report-list') {
      this.header = this.translate.instant('menu.myReports');
    }
  }

  editCategories() {
    this.reportService.editMode = !this.reportService.editMode;
  }
}

