import { Component, OnInit } from '@angular/core';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { trashBin, addCircleOutline } from "ionicons/icons";
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  async ngOnInit() {
    await this.fetchLists();
    this.loading = false;
  }

  async fetchLists() {
    try {
      client.models.ShoppingList.observeQuery().subscribe({
        next: ({ items, isSynced }) => {
          this.shoppingLists = items;
          //console.log(this.shoppingLists);
        },
      });
    } catch (error) {
      console.error('error fetching items', error);
    }
  }

  async getUser(): Promise<string> {
    const user = await fetchUserAttributes();
    return user['custom:DisplayName']!;
  }


  async addList() {
    const user = getCurrentUser();
    try {
      const list = await client.models.ShoppingList.create({
        date: new Date().toISOString(),
        name: this.newListName,
        users: [(await user).userId]
      },
      {
        authMode: 'userPool',
      });

      this.fetchLists();

    } catch (error) {
      console.error('error creating item', error);
    }
  }

  //TODO Router??

  async deleteList(list: Schema['ShoppingList']['type']) {
    const itemToBeDeleted = {
      id: list.id
    }
    try {
      const deletedList = await client.models.ShoppingList.delete(itemToBeDeleted);
      console.log('Deleting ' + deletedList.data?.name);

      await this.fetchLists();
    } catch (error) {
      console.error('error creating item', error);
    }
  }

  parseDate(isoDate: string) {
    const date = new Date(isoDate);
    const formatedDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    return formatedDate;
  }

  go(url: string) {
    this.router.navigateByUrl('my-lists/' + url)
  }
}
