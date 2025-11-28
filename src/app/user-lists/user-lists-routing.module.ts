import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListsComponent } from './user-lists.component';
import { ShoppingListComponent } from '../shopping-list/shopping-list.component';

const routes: Routes = [
  {
    path: '',
    component: UserListsComponent,
  },
  {
    path: ':id',
    component: ShoppingListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserListsRoutingModule {}

