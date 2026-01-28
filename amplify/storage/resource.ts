import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'audioStorage',
  access: (allow) => ({
    'public/audio/*': [
      allow.authenticated.to(['read', 'write']),
    ],
  }),
});
