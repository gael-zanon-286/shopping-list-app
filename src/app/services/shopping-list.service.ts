import { Inject, Injectable } from "@angular/core";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import { LAMBDA_FUNCTION_NAME, LAMBDA_REGION } from "../app.module";
import { Schema } from "../../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  private lambdaClient: LambdaClient;
  private functionName: string;
  private client;

  constructor(@Inject(LAMBDA_REGION) region: string, @Inject(LAMBDA_FUNCTION_NAME) functionName: string) {
    this.lambdaClient = new LambdaClient({ region });
    this.functionName = functionName;
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





