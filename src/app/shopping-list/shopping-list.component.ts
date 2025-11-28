import { Component, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { getCurrentUser } from 'aws-amplify/auth';


const client = generateClient<Schema>();

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css'
})
export class ShoppingListComponent {
  shoppingLists: any[] = [];

  ngOnInit() {
    this.fetchLists();
  }

  fetchLists() {
      try {
        client.models.ShoppingList.observeQuery().subscribe({
          next: ({ items, isSynced }) => {
            this.shoppingLists = items;
          },
        });
      } catch (error) {
        console.error('error fetching items', error);
      }
    }

 async addList(listName: string) {
    try {
      const list = await client.models.ShoppingList.create({
        date: new Date().toISOString(),
        name: listName
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
}
