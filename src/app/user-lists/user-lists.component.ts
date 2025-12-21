import { Component, OnInit } from '@angular/core';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';
import { trashBin, addCircleOutline } from "ionicons/icons";
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import { Router } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { DateService } from '../services/date.service';
import { ListService } from '../services/list.service';
import { AlertController } from '@ionic/angular';

const client = generateClient<Schema>();

@Component({
  selector: 'app-user-lists',
  templateUrl: './user-lists.component.html',
  standalone: false,
  styleUrls: ['./../../styles.css'],
})
export class UserListsComponent implements OnInit {
  shoppingLists: any[] = [];
  newListName: string | null = null;
  trashBin = trashBin;
  addCircleOutline = addCircleOutline;
  loading: boolean = true;

  constructor(
    private translate: TranslateService,
    private alertController: AlertController,
    private router: Router,
    public dateService: DateService,
    private listService: ListService) {}

  async ngOnInit() {
    this.shoppingLists = await this.listService.fetchLists('ACTIVE');
    this.loading = false;
  }

  // Obtain current user
  async getUser(): Promise<string> {
    const user = await fetchUserAttributes();
    return user['custom:DisplayName']!;
  }

  // Create new list
  async addList() {
    if (this.newListName) {
      await this.listService.addList(this.newListName);
      this.shoppingLists = await this.listService.fetchLists('ACTIVE');
      this.newListName = null;
    } else {
      console.log('No name introduced');
    }

  }

  // Delete list
  async deleteList(list: Schema['ShoppingList']['type']) {
    await this.listService.deleteList(list);
    this.shoppingLists = await this.listService.fetchLists('ACTIVE');
  }

  // Navigate to selected list
  go(url: string) {
    this.router.navigateByUrl('my-lists/' + url);
  }

  // Deletion confirmation dialog
  async confirmationAlert(list: Schema['ShoppingList']['type']) {
    const alert = await this.alertController.create({
     header: this.translate.instant('confirmation'),
     subHeader: list.name,
     message: this.translate.instant('confirmListDeletion'),
     buttons: [
       {
         text: this.translate.instant('no'),
         role: 'cancel',
       },
       {
         text: this.translate.instant('yes'),
         role: 'confirm',
         handler: () => {
           this.deleteList(list);
         }
       }
     ]
   });
   await alert.present();
  }
}
