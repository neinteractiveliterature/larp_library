import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { genericOAuth } from 'better-auth/plugins';
import { createRemoteJWKSet } from 'jose';
import { env } from '../env';
import { db } from '../db';
import * as schema from '../db/schema';
import { intercodeProfileFromAccessToken } from './intercodeProfile.server';

export const INTERCODE_PROVIDER_ID = 'intercode';

const intercodeKeys = createRemoteJWKSet(new URL('/oauth/discovery/keys', env.INTERCODE_URL));

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  // Set explicitly, not worked out from each request's Host header: the deployed function is behind CloudFront, and the callback
  // URL sent to Intercode must be exactly the one registered there
  baseURL: env.APP_URL_BASE,
  database: drizzleAdapter(db, { provider: 'pg', schema, usePlural: true }),
  advanced: {
    // The tables use integer serial ids (Rails' ids, which existing rows and foreign keys depend on), so better-auth
    // leaves id generation to the database.
    database: { generateId: 'serial' },
  },
  user: {
    // The rest of the users row, which better-auth passes through without owning. Users can't set these themselves.
    additionalFields: {
      firstname: { type: 'string', required: false, input: false },
      lastname: { type: 'string', required: false, input: false },
      admin: { type: 'boolean', required: false, input: false, defaultValue: false },
    },
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: INTERCODE_PROVIDER_ID,
          clientId: env.INTERCODE_APP_ID,
          clientSecret: env.INTERCODE_APP_SECRET,
          discoveryUrl: new URL('/.well-known/openid-configuration', env.INTERCODE_URL).toString(),
          scopes: ['public', 'openid'],
          pkce: true,
          // The Intercode user id: the same value Rails stored in users.uid, so existing users keep their rows.
          accountSubject: ({ profile }) => {
            if (!profile.id) throw new Error('The Intercode profile has no user id');
            return profile.id;
          },
          getUserInfo: async (tokens) => {
            if (!tokens.accessToken) return null;
            return intercodeProfileFromAccessToken(tokens.accessToken, intercodeKeys);
          },
          mapProfileToUser: (profile) => ({
            firstname: profile.firstname,
            lastname: profile.lastname,
          }),
        },
      ],
    }),
  ],
});
