import { CognitoIdentityProviderClient, ListUsersCommand } from "@aws-sdk/client-cognito-identity-provider";
import { Schema } from '../../data/resource';

const client = new CognitoIdentityProviderClient({ region: 'eu-west-3' });

export const handler: Schema['inviteUser']['functionHandler'] = async (event) => {
  const user = event.arguments.user;
  const userPoolId = 'eu-west-3_fPXLwEFs2';

  try {
    const command = new ListUsersCommand({
      UserPoolId: userPoolId,
      Filter: `preferred_username = "${user}"`,
      Limit: 1,
    });

    const response = await client.send(command);

    if (!response?.Users || response.Users.length === 0) {
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

