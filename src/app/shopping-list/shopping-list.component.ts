import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Schema } from '../../../amplify/data/resource';
import { add, close, create, mic } from 'ionicons/icons';
import { HeaderService } from '../services/header.service';
import { IonModal, ModalController, AlertController } from '@ionic/angular';
import { AddFriendModal } from './add-friend/add-friend-modal.component';
import { TranslateService } from "@ngx-translate/core";
import { ListService } from '../services/list.service';
import { ItemService } from '../services/item.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import type { RefresherCustomEvent } from '@ionic/core';
import { VoiceRecognitionService } from '../services/voice-recognition.service';

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
  isListening: boolean = false;
  isListeningRegular: boolean = false;
  items: Schema['Item']['type'][] = [];
  commonItems: Schema['Item']['type'][] = [];
  shoppingList!: Schema['ShoppingList']['type'] | null;
  defaultList!: Schema['ShoppingList']['type'] | null;
  editMode: boolean = false;
  add = add;
  mic = mic;
  create = create;
  newItemName: string = '';
  regularItemName: string = '';
  close = close;

  constructor(
    private alertController: AlertController,
    private voiceRecognitionService: VoiceRecognitionService,
    private router: Router,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private modalCtrl: ModalController,
    private listService: ListService,
    private translate: TranslateService,
    private itemService: ItemService) {
      this.voiceRecognitionService.textEmitter.subscribe((text: string) => {
        if (this.isListening) {
          this.newItemName = text;
        }
        if (this.isListeningRegular) {
          this.regularItemName = text;
        }
      });
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

    this.defaultList = await this.listService.fetchDefaultList();
    this.commonItems = await this.itemService.fetchItems(this.defaultList!);

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

  toggleEditMode() {
    this.editMode = !this.editMode;
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

  // Obtain all items in default list
  async fetchCommonItems() {
    this.commonItems = await this.itemService.fetchItems(this.defaultList!);
  }

  // Create item
  async createItem(name: string) {
    if (this.newItemName === '') {
      return;
    } else {
      await this.itemService.createItem(name, this.shoppingList!);
      this.fetchItems();
      this.voiceRecognitionService.text = '';
      this.newItemName = '';
    }
  }

  // Create regular item
  async addRegularItem(name: string) {
    await this.itemService.createItem(name, this.defaultList!);
    this.fetchCommonItems();
    this.regularItemName = '';
  }

  // Checkbox toggle
  async checkboxToggle(item: Schema['Item']['type']) {
    await this.itemService.strikeItem(item);
    if (item.isStriked) {
      await this.itemService.createItem(item.name, this.shoppingList!);
    } else {
      await this.itemService.deleteItemByName(item.name, this.shoppingList!.id);
    }
    this.fetchItems();
  }

  // Delete regular item
  async deleteRegularItem(item: Schema['Item']['type']) {
    await this.itemService.deleteItem(item, this.defaultList!.id);

    this.fetchCommonItems();
  }

  // Delete item
  async deleteItem(item: Schema['Item']['type']) {
    await this.itemService.deleteItem(item, this.shoppingList!.id);

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

  startRecording() {
    if (!this.isListening) {
      this.isListening = true;
      this.voiceRecognitionService.start();
    }
  }

  stopRecording() {
    if (this.isListening) {
      this.voiceRecognitionService.stop();
      this.newItemName = '';
      this.voiceRecognitionService.text = '';
      this.isListening = false;
    }
  }

  toggleRecording() {
    if (!this.isListening && !this.isListeningRegular) {
      this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  toggleRecordingDefaults() {
    if (!this.isListening && !this.isListeningRegular) {
      this.startRecordingDefaults();
    } else {
      this.stopRecordingDefaults();
    }
  }

  startRecordingDefaults() {
    if (!this.isListeningRegular) {
      this.isListeningRegular = true;
      this.voiceRecognitionService.start();
    }
  }

  stopRecordingDefaults() {
    if (this.isListeningRegular) {
      this.voiceRecognitionService.stop();
      this.regularItemName = '';
      this.voiceRecognitionService.text = '';
      this.isListeningRegular = false;
    }
  }

}

