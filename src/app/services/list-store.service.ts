import { Injectable } from "@angular/core";
import { Schema } from "../../../amplify/data/resource";

@Injectable({ providedIn: 'root' })
export class ListStoreService {
  list: Schema['ShoppingList']['type'] | null = null;
}
