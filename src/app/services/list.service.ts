import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Schema } from '../../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import { getCurrentUser } from 'aws-amplify/auth';
import { ShoppingListService } from './shopping-list.service';
import { ItemService } from './item.service';

interface newHistorical {
  list: Schema['ShoppingList']['type'],
  items: Schema['Item']['type'][]
}

@Injectable({ providedIn: 'root' })
export class ListService {
  private createHistoricListSource = new Subject<newHistorical>();
  createHistoricList$ = this.createHistoricListSource.asObservable();
  private client;

  constructor(private itemService: ItemService, private shoppingListService: ShoppingListService) {
    this.client = generateClient<Schema>();
  }

  // Obtain all active shopping lists
  async fetchLists(filter: string): Promise<Schema['ShoppingList']['type'][]> {
    try {
      const {data: lists } = await this.client.models.ShoppingList.list({
        filter: {
            type: { eq: filter }
          }
      });
      return lists;
    } catch (error) {
      console.error('error fetching lists', error);
      return [];
    }
  }

  // Add new active shopping list
  async addList(newName: string): Promise<Schema['ShoppingList']['type'] | undefined> {
    const user = await getCurrentUser();
    try {
      const { data } = await this.client.models.ShoppingList.create({
        type: 'ACTIVE',
        date: new Date().toISOString(),
        name: newName,
        users: [user.userId]
      },
      {
        authMode: 'userPool',
      });

      return data ?? undefined;

    } catch (error) {
      console.error('error creating item', error);
      return undefined;
    }
  }

  // Add user to allowed list of users on list
  async updateListUsers(newOwner: string, shoppingList: Schema['ShoppingList']['type']) {
    const newOwnerId = await this.shoppingListService.getUserIdByEmail(newOwner);

    if (!newOwnerId) {
      console.error("No user found for email:", newOwner);
      return;
    }

    if (!shoppingList.users!.includes(newOwnerId)) {
      shoppingList.users!.push(newOwnerId);
    } else {
      console.log('Already exists');
    }

    const listToBeUpdated = {
      id: shoppingList.id,
      users: shoppingList.users
    }
    const response = await this.client.models.ShoppingList.update(listToBeUpdated);

    // Update Item ownership (Inefficient but cheaper than lambdas)
    if (response.data) {
      const items = await response.data.items(); {
        for(let item of items.data) {
          this.itemService.updateItemOwnership(item, newOwnerId)
        }
      }
    }


    this.itemService
    return response;
  }

  // Modify list
  async updateListCost(shoppingList: Schema['ShoppingList']['type'], cost: number) {
    const listToBeUpdated = {
      id: shoppingList.id,
      totalCost: cost
    }
    await this.client.models.ShoppingList.update(listToBeUpdated);
  }

  // Get list by id
  async fetchList(id: string): Promise<Schema['ShoppingList']['type'] | null> {
    try {
      const response = await this.client.models.ShoppingList.get({ id: id });
      return response.data ?? null;
    } catch (error) {
      console.error('error fetching items', error);
      return null;
    }
  }

  // Delete list
  async deleteList(list: Schema['ShoppingList']['type']) {
    const listToBeDeleted = {
      id: list.id
    }
    try {
      const deletedList = await this.client.models.ShoppingList.delete(listToBeDeleted);
      return deletedList ?? undefined;
    } catch (error) {
      console.error('error creating item', error);
      return undefined;
    }
  }

  // Create new historic list from a current active list
  async createHistoricList(list: Schema['ShoppingList']['type'], items: Schema['Item']['type'][]): Promise<Schema['ShoppingList']['type'] | undefined> {
    const date = new Date().toISOString();

    const { data: newList, errors } = await this.client.models.ShoppingList.create({
      type: "HISTORIC",
      date: date,
      name: list.name,
      totalCost: 0
    },{
      authMode: "userPool"
    });

    if (errors) {
      console.error(errors);
      return undefined;
    }

    for (const item of items) {
      if (item.isStriked) {
        await this.client.models.Item.create({
          name: item.name,
          cost: item.cost,
          isStriked: false,
          listID: newList?.id
        },{
          authMode: "userPool"
        });
      }
    }
    return newList ?? undefined;
  }

}
