import { Injectable } from "@angular/core";
import { Schema } from "../../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  private client;

  constructor() {
    this.client = generateClient<Schema>()
  }

  public async getUserIdByEmail(user: string): Promise<string | null> {
    try {
      const data = await this.client.queries.inviteUser({
        user
      });
      return data.data ?? null;
    } catch (error) {
      console.error("Error calling lambda function", error);
      return null;
    }
  }
}





