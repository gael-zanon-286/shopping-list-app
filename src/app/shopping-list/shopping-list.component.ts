import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Schema } from '../../../amplify/data/resource';
import { add, close } from 'ionicons/icons';
import { HeaderService } from '../services/header.service';
import { IonModal, ModalController, AlertController } from '@ionic/angular';
import { AddFriendModal } from './add-friend/add-friend-modal.component';
import { TranslateService } from "@ngx-translate/core";
import { ListService } from '../services/list.service';
import { ItemService } from '../services/item.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import type { OverlayEventDetail, RefresherCustomEvent } from '@ionic/core';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  standalone: false,
  styleUrls: ['./../../styles.css'],
})
export class ShoppingListComponent  implements OnInit {
  private destroy$ = new Subject<void>();
  @ViewChild(IonModal) modal!: IonModal;
  listId: string = '';
  loading = true;
  items: Schema['Item']['type'][] = [];
  shoppingList!: Schema['ShoppingList']['type'] | null;
  add = add;
  newItemName: string = '';
  close = close;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private modalCtrl: ModalController,
    private listService: ListService,
    private translate: TranslateService,
    private itemService: ItemService) {
  }

  async ngOnInit() {
    // Set up listener for menu options
    this.headerService.deleteStriked$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.confirmationAlert();
    });

    // Set up listener for menu options
    this.headerService.addFriend$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.openModal();
    });

    // Set up listener to reload data when returning to it
    document.addEventListener('visibilitychange', this.handleVisibilityChange);

    this.listId = this.route.snapshot.paramMap.get('id')!;

    await this.fetchList();

    this.loading = false;
  }

  // Unsubscribe from listeners
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  handleVisibilityChange = () => {
    if (!document.hidden) {
      this.fetchList();
    }
  };

  handleRefresh(event: RefresherCustomEvent) {
    this.loading = true;
    setTimeout(async () => {
      this.shoppingList = await this.listService.fetchList(this.listId);
      event.target.complete();
      this.loading = false;
    }, 1000);
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
    await this.itemService.createItem(this.newItemName, this.shoppingList!);
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
  async deleteStriked(data: any) {
    const newList = await this.listService.createHistoricList(this.shoppingList!, this.items!);
    for (let item of this.items) {
      if (item.isStriked) {
        this.deleteItem(item);
      }
    }
    if (data.includes('navigate')) {
      this.router.navigateByUrl('historic-lists/' + newList?.id);
    }
  }

  // Add user to allowed list of users on list
  async updateList(newOwner: string) {
    this.listService.updateListUsers(newOwner, this.shoppingList!)
  }

  // Modal to add new user to list
  async openModal() {
    const modal = await this.modalCtrl.create({
      component: AddFriendModal,
      cssClass: 'add-friend-modal'
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.updateList(data);
    }
  }

  // Deletion confirmation dialog
  async confirmationAlert() {
    const alert = await this.alertController.create({
     header: this.translate.instant('confirmation'),
     message: this.translate.instant('confirmDeletion'),
     inputs: [
       {
         name: 'navigate',
         type: 'checkbox',
         label: this.translate.instant('confirmNavigation'),
         value: 'navigate'
       }
     ],
     buttons: [
       {
         text: this.translate.instant('no'),
         role: 'cancel',
       },
       {
         text: this.translate.instant('yes'),
         role: 'confirm',
         handler: (data) => {
           this.deleteStriked(data);
         }
       }
     ]
   });
   await alert.present();
  }
}

