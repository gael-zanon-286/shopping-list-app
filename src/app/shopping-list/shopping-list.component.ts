import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '../../../amplify/data/resource';
import { add, close } from 'ionicons/icons';
import { HeaderService } from '../header/header.service';
import { IonModal, ModalController } from '@ionic/angular';
import { AddFriendModal } from './add-friend/add-friend-modal.component';
import { ShoppingListService } from '../services/shopping-list.service';
//import { MaskitoOptions, MaskitoElementPredicate, maskitoTransform } from '@maskito/core';

const client = generateClient<Schema>();

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent  implements OnInit {
  private shoppingListService: ShoppingListService
  @ViewChild(IonModal) modal!: IonModal;
  listId: string = '';
  loading = true;
  items: Schema['Item']['type'][] = [];
  shoppingList!: Schema['ShoppingList']['type'] | null;
  add = add;
  newItemName: string = '';
  close = close;
  showPrice: any;
  message = 'Add Friends to the shopping list.';
  @Output() headerEvent = new EventEmitter<string>();
    customActionSheetOptions = {
    header: 'Options',
  };
/*   readonly priceMask: MaskitoOptions = {
    mask: [/\d/, '€']
  }; */

  constructor(private route: ActivatedRoute, private headerService: HeaderService, private modalCtrl: ModalController,) {
    this.shoppingListService = new ShoppingListService('eu-west-3', 'invite-user');
  }

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
      cost: item.cost,
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

  async updateList(newOwner: string) {
    const newOwnerId = await this.shoppingListService.getUserIdByEmail(newOwner);

    if (!newOwnerId) {
      console.error("No user found for email:", newOwner);
      return;
    }

    if (!this.shoppingList!.users!.includes(newOwner)) {
      this.shoppingList!.users!.push(newOwner);
    }
    const listToBeUpdated = {
      id: this.listId,
      users: this.shoppingList?.users
    }
    const updatedList = await client.models.ShoppingList.update(listToBeUpdated);
    console.log(updatedList.data);
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: AddFriendModal,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.updateList(data);
    }
  }

}
