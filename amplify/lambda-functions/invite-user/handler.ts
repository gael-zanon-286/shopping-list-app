import { CognitoIdentityProviderClient, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Schema } from '../../data/resource';

const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

export const handler: Schema['inviteUser']['functionHandler'] = async (event) => {
  const user = event.arguments.user;
  const userPoolId = process.env.USER_POOL_ID;

  // Check valid user pool
  if (!userPoolId) {
    throw new Error("USER_POOL_ID is not defined");
  }

  try {
    const command = new ListUsersCommand({
      UserPoolId: userPoolId,
      Filter: `preferred_username = "${user}"`,
      Limit: 1,
    });

    const response = await client.send(command);

    // Check if user exists
    if (!response.Users || response.Users.length === 0) {
      throw new Error("User not found");
    }

    const subAttr = response.Users[0].Attributes?.find(attr => attr.Name === "sub");

    if (!subAttr?.Value) {
      throw new Error("User ID not found");
    }

    return subAttr.Value;

  } catch (err: any) {
    console.error(err);

    throw new Error(err.message || "Internal server error");
  }
};

