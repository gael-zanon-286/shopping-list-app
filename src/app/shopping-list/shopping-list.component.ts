import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Schema } from '../../../amplify/data/resource';
import { add, close } from 'ionicons/icons';
import { HeaderService } from '../services/header.service';
import { IonModal, ModalController } from '@ionic/angular';
import { AddFriendModal } from './add-friend/add-friend-modal.component';
import { ListService } from '../services/list.service';
import { ItemService } from '../services/item.service';
//import { MaskitoOptions, MaskitoElementPredicate, maskitoTransform } from '@maskito/core';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  standalone: false,
  styleUrls: ['./../../styles.css'],
})
export class ShoppingListComponent  implements OnInit {
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

  constructor(private router: Router, private route: ActivatedRoute, private headerService: HeaderService, private modalCtrl: ModalController, private listService: ListService, private itemService: ItemService) {
  }

  async ngOnInit() {
    this.headerService.deleteStriked$.subscribe(() => {
      this.deleteStriked();
    });
    this.headerService.addFriend$.subscribe(() => {
      this.openModal();
    });
    this.listId = this.route.snapshot.paramMap.get('id')!;

    await this.fetchList();

    this.loading = false;
  }

  // Obtain list data
  async fetchList() {
    this.shoppingList = await this.listService.fetchList(this.listId);
    if (this.shoppingList) {
    this.headerService.sendMessage(this.shoppingList.name);
    }
    this.fetchItems();
  }

  // Obtain all items in list
  async fetchItems() {
    this.items = await this.itemService.fetchItems(this.shoppingList!);
  }

  // Create item
  async createItem() {
    await this.itemService.createItem(this.newItemName, this.listId);
    this.fetchItems();
    this.newItemName = '';
  }

  // Delete item
  async deleteItem(item: Schema['Item']['type']) {
    await this.itemService.deleteItem(item);

    this.fetchItems();
  }

  // Modify item
  async updateItem(item: Schema['Item']['type']) {
    await this.itemService.strikeItem(item);

    this.fetchItems();
  }

  // Remove strike items from list and create new historic with said items
  async deleteStriked() {
    const newList = await this.listService.createHistoricList(this.shoppingList!, this.items!);
    for (let item of this.items) {
      if (item.isStriked) {
        this.deleteItem(item);
      }
    }
    this.router.navigateByUrl('historic-lists/' + newList?.id);
  }

  // Add user to allowed list of users on list
  async updateList(newOwner: string) {
    this.listService.updateListUsers(newOwner, this.shoppingList!)
  }

  // Modal to add new user to list
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
