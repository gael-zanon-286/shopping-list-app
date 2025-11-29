import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

export class ShoppingListService {
  private lambdaClient: LambdaClient;
  private functionName: string;

  constructor(region: string, functionName: string) {
    this.lambdaClient = new LambdaClient({ region });
    this.functionName = functionName;
  }

  public async getUserIdByEmail(email: string): Promise<string | null> {
    const payload = JSON.stringify({ email });

    const command = new InvokeCommand({
      FunctionName: this.functionName,
      Payload: Buffer.from(payload),
    });

    try {
      const response = await this.lambdaClient.send(command);

      if (!response.Payload) return null;

      const lambdaResult = JSON.parse(Buffer.from(response.Payload).toString());

      if (lambdaResult.statusCode !== 200) {
        console.error("Lambda error:", lambdaResult.body);
        return null;
      }

      const body = JSON.parse(lambdaResult.body);

      return body.userId || null;
    } catch (error: any) {
      console.error("Error calling Lambda:", error.message || error);
      return null;
    }
  }
}





