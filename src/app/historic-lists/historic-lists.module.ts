import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HistoricListsComponent } from './historic-lists.component';
import { HistoricListsRoutingModule } from './historic-lists-routing.module';
import { HistoricListItemsComponent } from './historic-list-items/historic-list-items.component';



@NgModule({
  declarations: [HistoricListsComponent, HistoricListItemsComponent],
  exports: [HistoricListsComponent, HistoricListItemsComponent],
  imports: [
    CommonModule, IonicModule, FormsModule, TranslateModule, HistoricListsRoutingModule
  ]
})
export class HistoricListsModule { }
