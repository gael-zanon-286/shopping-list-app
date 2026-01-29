import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import * as iam from "aws-cdk-lib/aws-iam";
import * as cdk from "aws-cdk-lib";
import { data } from './data/resource';
import { inviteUser } from './lambda-functions/invite-user/resource';

export const backend: any = defineBackend({
  auth,
  data,
  inviteUser
});

const inviteUserLambda = backend.inviteUser.resources.lambda;

inviteUserLambda.addEnvironment(
  "USER_POOL_ID",
  backend.auth.resources.userPool.userPoolId
);

const listUsersStatement = new iam.PolicyStatement({
  sid: "AllowListUsers",
  actions: ["cognito-idp:ListUsers"],
  resources: [backend.auth.resources.userPool.userPoolArn],
});

inviteUserLambda.addToRolePolicy(listUsersStatement);

