import { Component, OnInit } from '@angular/core';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { trashBin, addCircleOutline } from "ionicons/icons";
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import { Router } from '@angular/router';
import { DateService } from '../services/date.service';
import { ListService } from '../services/list.service';

const client = generateClient<Schema>();

@Component({
  selector: 'app-user-lists',
  templateUrl: './user-lists.component.html',
  standalone: false,
  styleUrls: ['./../../styles.css'],
})
export class UserListsComponent implements OnInit {
  shoppingLists: any[] = [];
  newListName: string = '';
  trashBin = trashBin;
  addCircleOutline = addCircleOutline;
  loading: boolean = true;

  constructor(private router: Router, public dateService: DateService, private listService: ListService) {}

  async ngOnInit() {
    this.shoppingLists = await this.listService.fetchLists('ACTIVE');
    this.loading = false;
  }

  async getUser(): Promise<string> {
    const user = await fetchUserAttributes();
    return user['custom:DisplayName']!;
  }

  async addList() {
    await this.listService.addList(this.newListName);
    this.shoppingLists = await this.listService.fetchLists('ACTIVE');
  }

  async deleteList(list: Schema['ShoppingList']['type']) {
    await this.listService.deleteList(list);
    this.shoppingLists = await this.listService.fetchLists('ACTIVE');
  }

  go(url: string) {
    this.router.navigateByUrl('my-lists/' + url);
  }
}
