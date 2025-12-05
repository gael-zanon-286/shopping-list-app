import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import * as iam from "aws-cdk-lib/aws-iam"
import { data } from './data/resource';
import { inviteUser } from './lambda-functions/invite-user/resource';

export const backend: any = defineBackend({
  auth,
  data,
  inviteUser
});

const inviteUserLambda = backend.inviteUser.resources.lambda;

const statement = new iam.PolicyStatement({
  sid: "AllowListUsers",
  actions: ["cognito-idp:ListUsers"],
  resources: ["arn:aws:cognito-idp:eu-west-3:592653933583:userpool/eu-west-3_fPXLwEFs2"],
})


inviteUserLambda.addToRolePolicy(statement);
