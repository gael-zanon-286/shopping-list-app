import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListsComponent } from './user-lists.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { UserListsRoutingModule } from './user-lists-routing.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [UserListsComponent],
  exports: [UserListsComponent],
  imports: [
    CommonModule, IonicModule, FormsModule, UserListsRoutingModule, TranslateModule
  ],
})
export class UserListsModule { }
