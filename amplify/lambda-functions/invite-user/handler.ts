import type { Handler } from 'aws-lambda';
import { CognitoIdentityProviderClient, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

export const handler: Handler = async (event) => {
  try {
    const email = event.email;

    const userPoolId = process.env.USER_POOL_ID;

    const command = new ListUsersCommand({
      UserPoolId: userPoolId,
      Filter: `email = "${email}"`,
      Limit: 1,
    });

    const response = await client.send(command);

    if (!response?.Users || response.Users.length === 0) {
      return {
          statusCode: 404,
          body: JSON.stringify({ error: "User not found" }),
      };
    }

      const subAttr = response.Users[0].Attributes?.find(attr => attr.Name === "sub");

    if (!subAttr?.Value) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "User ID not found" }),
      };
    }

    const userId = subAttr.Value;

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ userId }),
    };

  } catch (error: any) {
    console.error(error);
    return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal server error", details: error.message }),
    };
  }

};
