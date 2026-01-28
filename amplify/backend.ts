import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import * as iam from "aws-cdk-lib/aws-iam";
import { data } from './data/resource';
import { inviteUser } from './lambda-functions/invite-user/resource';
import { storage } from './storage/resource';

export const backend: any = defineBackend({
  auth,
  data,
  inviteUser,
  storage
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

const authRole = backend.auth.resources.authenticatedUserIamRole;

authRole.addToPrincipalPolicy(
  new iam.PolicyStatement({
    sid: 'AllowTranscribe',
    actions: [
      'transcribe:StartTranscriptionJob',
      'transcribe:GetTranscriptionJob',
    ],
    resources: ['*'],
  })
);


