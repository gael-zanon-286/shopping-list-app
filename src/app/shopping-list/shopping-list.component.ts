<<<<<<< HEAD
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
=======
import { Component, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { getCurrentUser } from 'aws-amplify/auth';

>>>>>>> parent of b3da35a (feat: implemented navigation, item creation and improved UI)

const client = generateClient<Schema>();

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [NgForOf],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css'
})
<<<<<<< HEAD
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
=======
export class ShoppingListComponent {
  shoppingLists: any[] = [];

  ngOnInit() {
    this.fetchLists();
>>>>>>> parent of b3da35a (feat: implemented navigation, item creation and improved UI)
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
<<<<<<< HEAD
      const response = await client.models.ShoppingList.get({ id: this.listId! });
      this.shoppingList = response.data;
      this.headerService.sendMessage(this.shoppingList!.name);
      await this.fetchItems();
=======
      const list = await client.models.ShoppingList.create({
        date: new Date().toISOString(),
        name: listName
      },
      {
        authMode: 'userPool',
      });

      await console.log('Created', list.data?.name);

      await this.fetchLists();

>>>>>>> parent of b3da35a (feat: implemented navigation, item creation and improved UI)
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

<<<<<<< HEAD
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
=======
      await this.fetchLists();
    } catch (error) {
      console.error('error creating item', error);
    }
>>>>>>> parent of b3da35a (feat: implemented navigation, item creation and improved UI)
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
