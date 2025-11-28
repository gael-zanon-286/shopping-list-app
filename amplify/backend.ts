import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { inviteUser } from './lambda-functions/invite-user/resource';

defineBackend({
  auth,
  data,
  inviteUser
});
