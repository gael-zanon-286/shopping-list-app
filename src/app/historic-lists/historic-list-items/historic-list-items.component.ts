import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Schema } from '../../../../amplify/data/resource';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { generateClient } from 'aws-amplify/data';
import { add, close } from 'ionicons/icons';
import { ListStoreService } from '../../services/list-store.service';
import { DateService } from '../../services/date.service';
import { ItemService } from '../../services/item.service';
import { ListService } from '../../services/list.service';

const client = generateClient<Schema>();

@Component({
  selector: 'app-historic-list-items',
  templateUrl: './historic-list-items.component.html',
})
export class HistoricListItemsComponent  implements OnInit {
  listId: string = '';
  loading = true;
  items: Schema['Item']['type'][] = [];
  shoppingList!: Schema['ShoppingList']['type'] | null;
  add = add;
  newItemName: string = '';
  close = close;
  editMode: boolean = false;
  totalCost: number | undefined;
  message = 'Add Friends to the shopping list.';
  @Output() headerEvent = new EventEmitter<string>();
    customActionSheetOptions = {
    header: 'Options',
  };
/*   readonly priceMask: MaskitoOptions = {
    mask: [/\d/, '€']
  }; */

  constructor(private route: ActivatedRoute, private headerService: HeaderService, private storeService: ListStoreService, public dateService: DateService, private itemService: ItemService, private listService: ListService) {
  }

  async ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('id')!;

    await this.fetchList();
    this.storeService.list = this.shoppingList;
    if (this.shoppingList?.totalCost) {
      this.totalCost = this.shoppingList?.totalCost;
    }

    this.loading = false;
  }

  // Obtain list data
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

  // Obtain all items in list
  async fetchItems() {
    const { data } = await this.shoppingList!.items();
    this.items = data;
  }

  // Create item
  async createItem() {
    const { data: item } = await client.models.Item.create({
      name: this.newItemName,
      listID: this.listId
    });
    console.log('Created', item?.name);

    await this.fetchItems();
    this.newItemName = '';
  }

  // Delete item
  async deleteItem(item: Schema['Item']['type']) {
    const itemToBeDeleted = {
      id: item.id
    }
    const deletedItem = await client.models.Item.delete(itemToBeDeleted);
    console.log('Deleting ' + deletedItem.data?.name);

    await this.fetchItems();
  }

  // Modify item
  async updateItem(item: Schema['Item']['type']) {
    const itemToBeUpdated = {
      id: item.id,
      isStriked: !item.isStriked,
      cost: item.cost,
    }
    const updatedItem = await client.models.Item.update(itemToBeUpdated);
    console.log('Updating ' + updatedItem.data?.name);

    await this.fetchItems();
  }

  async updateList() {
    for (let item of this.items) {
      await this.itemService.updateItemCost(item);
    }

    this.totalCost = 0;
    for (let item of this.items) {
      if (item.cost) {
        this.totalCost += item.cost;
      }
    }

    this.listService.updateListCost(this.shoppingList!, this.totalCost!);
    this.fetchList();
  }

}
