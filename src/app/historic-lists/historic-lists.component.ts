import { Component, OnInit } from '@angular/core';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../../amplify/data/resource';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { DateService } from '../services/date.service';
import { ListService } from '../services/list.service';
import { RefresherCustomEvent } from '@ionic/angular';

const client = generateClient<Schema>();

@Component({
  selector: 'app-historic-lists',
  templateUrl: './historic-lists.component.html'
})
export class HistoricListsComponent  implements OnInit {
  historicLists: any[] = [];
  loading = true;
  newList$: Observable<Schema> | null = null;


  constructor(private router: Router, private listService: ListService, public dateService: DateService) { }

  async ngOnInit() {
    // Set up listener to reload data when returning to it
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    await this.fetchLists();

    this.router.events.pipe(filter((event: any) => event instanceof NavigationEnd)).subscribe(() => {
      this.fetchLists();
    });
  }

  // Unsubscribe from listeners
  ngOnDestroy() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  handleVisibilityChange = async () => {
    if (!document.hidden) {
      await this.fetchLists();
    }
  };

  async fetchLists() {
    this.loading = true;
    this.historicLists = await this.listService.fetchLists('HISTORIC');
    this.loading = false;
  }

  go(url: string) {
    this.router.navigateByUrl('historic-lists/' + url);
  }

  handleRefresh(event: RefresherCustomEvent) {
    this.loading = true;
    setTimeout(async () => {
      this.historicLists = await this.listService.fetchLists('HISTORIC');
      event.target.complete();
      this.loading = false;
    }, 1000);
  }

}
