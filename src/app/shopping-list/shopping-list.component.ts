import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../../amplify/data/resource';

const client = generateClient<Schema>();

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent  implements OnInit {
  listId: string = '';
  loading = true;
  items: Schema['Item']['type'][] = [];
  shoppingList!: Schema['ShoppingList']['type'] | null;

  constructor(private route: ActivatedRoute) { }

  async ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('id')!;

    await this.fetchList();

    this.loading = false;
  }

  async fetchList() {
    try {
      const response = await client.models.ShoppingList.get({ id: this.listId! });
      this.shoppingList = response.data;
      await this.fetchItems();
    } catch (error) {
      console.error('error fetching items', error);
    }
  }

  async fetchItems() {
    const { data } = await this.shoppingList!.items();
    this.items = data;
  }

  async createItem() {
    const { data: item } = await client.models.Item.create({
      name: 'test',
      listID: this.listId
    });

    await console.log('Created', item?.name);

    await this.fetchItems();
  }
}
