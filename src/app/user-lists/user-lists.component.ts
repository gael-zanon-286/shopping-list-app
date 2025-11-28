import { Component, OnInit } from '@angular/core';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { trashBin, addCircleOutline } from "ionicons/icons";


const client = generateClient<Schema>();

@Component({
  selector: 'app-user-lists',
  templateUrl: './user-lists.component.html',
  styleUrls: ['./user-lists.component.css'],
})
export class UserListsComponent implements OnInit {
  shoppingLists: any[] = [];
  newListName: string = '';
  trashBin = trashBin;
  addCircleOutline = addCircleOutline;

  ngOnInit() {
    this.fetchLists();
  }

    fetchLists() {
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

 async addList() {
  console.log(this.newListName);
    try {
      const list = await client.models.ShoppingList.create({
        date: new Date().toISOString(),
        name: this.newListName
      },
      {
        authMode: 'userPool',
      });

      await console.log('Created', list.data?.name);

      await this.fetchLists();

    } catch (error) {
      console.error('error creating item', error);
    }
  }

  //TODO Router??

  async deleteList(list: any) {
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
}
