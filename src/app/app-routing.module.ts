import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'my-lists',
    pathMatch: 'full'

  },
  {
    path: 'my-lists',
    loadChildren: () => import('./user-lists/user-lists.module').then(m => m.UserListsModule)
  },
  {
    path: 'test',
    loadChildren: () => import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
