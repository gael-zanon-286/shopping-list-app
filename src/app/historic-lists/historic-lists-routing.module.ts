import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoricListsComponent } from './historic-lists.component';
import { HistoricListItemsComponent } from './historic-list-items/historic-list-items.component';

const routes: Routes = [
  {
    path: '',
    component: HistoricListsComponent,
  },
  {
    path: ':id',
    component: HistoricListItemsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class HistoricListsRoutingModule { }
