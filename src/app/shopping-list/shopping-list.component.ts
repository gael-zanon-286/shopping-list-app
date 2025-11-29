import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../../amplify/data/resource';
import { add, close } from 'ionicons/icons';
import { HeaderService } from '../header/header.service';
//import { MaskitoOptions, MaskitoElementPredicate, maskitoTransform } from '@maskito/core';

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
  add = add;
  newItemName: string = '';
  close = close;
  showPrice: any;
  @Output() headerEvent = new EventEmitter<string>();
/*   readonly priceMask: MaskitoOptions = {
    mask: [/\d/, '€']
  }; */

  constructor(private route: ActivatedRoute, private headerService: HeaderService) { }

  async ngOnInit() {
    this.headerService.costToggle$.subscribe(value => {
      this.showPrice = value;
    });
    this.listId = this.route.snapshot.paramMap.get('id')!;

    await this.fetchList();

    this.loading = false;
  }

  async fetchList() {
    try {
      const response = await client.models.ShoppingList.get({ id: this.listId! });
      this.shoppingList = response.data;
      this.headerService.sendMessage(this.shoppingList!.name);
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
      name: this.newItemName,
      listID: this.listId
    });
    console.log('Created', item?.name);

    await this.fetchItems();
    this.newItemName = '';
  }

  async deleteItem(item: Schema['Item']['type']) {
    const itemToBeDeleted = {
      id: item.id
    }
    const deletedItem = await client.models.Item.delete(itemToBeDeleted);
    console.log('Deleting ' + deletedItem.data?.name);

    await this.fetchItems();
  }

  async updateItem(item: Schema['Item']['type']) {
    const itemToBeUpdated = {
      id: item.id,
      isStriked: !item.isStriked,
      cost: item.cost
    }
    const updatedItem = await client.models.Item.update(itemToBeUpdated);
    console.log('Updating ' + updatedItem.data?.name);

    await this.fetchItems();
  }

  async deleteCompleted() {
    console.log(this.items)
    for (let item of this.items) {
      if (item.isStriked) {
        this.deleteItem(item);
      }
    }

    await this.fetchItems();
  }
}
