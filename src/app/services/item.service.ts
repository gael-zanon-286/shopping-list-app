import { Injectable } from "@angular/core";
import { data, Schema } from "../../../amplify/data/resource";
import { generateClient } from 'aws-amplify/data';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private client;

  constructor() {
    this.client = generateClient<Schema>();
  }

  // Create item
  async createItem(newName: string, listId: string): Promise<Schema['Item']['type'] | undefined> {
    try {
      const { data: item } = await this.client.models.Item.create({
        name: newName,
        listID: listId
      });
      return item ?? undefined;
    } catch (error) {
      console.error('Failed to create item:', error);
      return undefined;
    }
  }

  // Obtain all items in list
  async fetchItems(list: Schema['ShoppingList']['type']): Promise<Schema['Item']['type'][]> {
    const { data } = await list.items();
    return data;
  }

  // Delete item
  async deleteItem(item: Schema['Item']['type']): Promise<void> {
    try {
      const itemToBeDeleted = {
        id: item.id
      }
      await this.client.models.Item.delete(itemToBeDeleted);
    } catch (error) {
      console.error('Failed to delete item:', error);
      return undefined;
    }
  }

  // Strikethrough item
  async strikeItem(item: Schema['Item']['type']): Promise<Schema['Item']['type'] | undefined> {
    try {
      const itemToBeUpdated = {
        id: item.id,
        isStriked: !item.isStriked
      }
      const updatedItem = await this.client.models.Item.update(itemToBeUpdated);
      return updatedItem.data ?? undefined;
    } catch (error) {
      console.error('Failed to update item:', error);
      return undefined;
    }
  }

  // Modify item cost
  async updateItemCost(item: Schema['Item']['type']): Promise<Schema['Item']['type'] | undefined> {
    try {
      const itemToBeUpdated = {
        id: item.id,
        cost: item.cost
      }
      const updatedItem = await this.client.models.Item.update(itemToBeUpdated);
      return updatedItem.data ?? undefined;
    } catch (error) {
      console.error('Failed to update item:', error);
      return undefined;
    }
  }
}
