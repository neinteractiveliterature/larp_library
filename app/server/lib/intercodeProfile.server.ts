import { jwtVerify, type JWTVerifyGetKey } from 'jose';
import { z } from 'zod';

// Intercode's OIDC claims don't include the user's email or name, but the access token it issues is a signed JWT that
// carries them in a `user` claim (see the access token generator in Intercode's doorkeeper initializer). That's also
// where the old Rails OmniAuth strategy got the user's id from. The id here is the same value as the OIDC `sub`.
const accessTokenPayloadSchema = z.object({
  user: z.object({
    id: z.union([z.number(), z.string()]),
    email: z.string().nullish(),
    name: z.string().nullish(),
    first_name: z.string().nullish(),
    last_name: z.string().nullish(),
  }),
});

export type IntercodeProfile = {
  /** The user's Intercode user id, as a string */
  id: string;
  email: string;
  name: string;
  firstname: string | null;
  lastname: string | null;
  emailVerified: true;
};

/**
 * Verifies an Intercode access token's signature and expiry against Intercode's published keys and returns the user it
 * identifies. Throws if the token isn't a valid, current Intercode token or has no email address.
 */
export async function intercodeProfileFromAccessToken(
  accessToken: string,
  getKey: JWTVerifyGetKey,
): Promise<IntercodeProfile> {
  const { payload } = await jwtVerify(accessToken, getKey, { algorithms: ['RS256'] });
  const { user } = accessTokenPayloadSchema.parse(payload);
  if (!user.email) {
    throw new Error('The Intercode access token has no email address for the user');
  }

  const name = user.name ?? [user.first_name, user.last_name].filter(Boolean).join(' ');
  return {
    id: String(user.id),
    email: user.email,
    name,
    firstname: user.first_name ?? null,
    lastname: user.last_name ?? null,
    // Intercode only issues tokens for accounts with a confirmed email address.
    emailVerified: true,
  };
}
