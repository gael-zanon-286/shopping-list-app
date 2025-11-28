import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingListComponent } from './shopping-list.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ShoppingListRoutingModule } from './shopping-list-routing.module';
import { AddFriendModal } from './add-friend/add-friend-modal.component';



@NgModule({
  declarations: [ShoppingListComponent, AddFriendModal],
  exports: [ShoppingListComponent, AddFriendModal],
  imports: [
    CommonModule, IonicModule, FormsModule, ShoppingListRoutingModule
  ]
})
export class ShoppingListModule { }
