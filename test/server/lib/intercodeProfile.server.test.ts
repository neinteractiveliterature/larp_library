// @vitest-environment node
import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT } from 'jose';
import { beforeAll, describe, expect, it } from 'vitest';
import { intercodeProfileFromAccessToken } from '~/.server/lib/intercodeProfile.server';

describe('intercodeProfileFromAccessToken', () => {
  let signingKey: CryptoKey;
  let getKey: ReturnType<typeof createLocalJWKSet>;

  beforeAll(async () => {
    const { privateKey, publicKey } = await generateKeyPair('RS256');
    signingKey = privateKey;
    getKey = createLocalJWKSet({ keys: [{ ...(await exportJWK(publicKey)), alg: 'RS256', use: 'sig' }] });
  });

  // Intercode's access tokens carry the user in a `user` claim, signed with RS256 (config/initializers/doorkeeper.rb)
  function signToken(user: Record<string, unknown>, options: { key?: CryptoKey; expiresIn?: string } = {}) {
    return new SignJWT({ user })
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuedAt()
      .setExpirationTime(options.expiresIn ?? '1h')
      .sign(options.key ?? signingKey);
  }

  it("reads the user's id, email and name from a valid token", async () => {
    const token = await signToken({
      id: 95240,
      email: 'tori@example.com',
      name: 'Tori C',
      first_name: 'Tori',
      last_name: 'C',
    });
    expect(await intercodeProfileFromAccessToken(token, getKey)).toEqual({
      id: '95240',
      email: 'tori@example.com',
      name: 'Tori C',
      firstname: 'Tori',
      lastname: 'C',
      emailVerified: true,
    });
  });

  it('builds the name from first and last name when the token has none', async () => {
    const token = await signToken({ id: 1, email: 'a@example.com', first_name: 'Ann', last_name: 'Lee' });
    expect((await intercodeProfileFromAccessToken(token, getKey)).name).toBe('Ann Lee');
  });

  it('rejects a token signed with some other key', async () => {
    const { privateKey } = await generateKeyPair('RS256');
    const token = await signToken({ id: 1, email: 'a@example.com' }, { key: privateKey });
    await expect(intercodeProfileFromAccessToken(token, getKey)).rejects.toThrow();
  });

  it('rejects an expired token', async () => {
    const token = await signToken({ id: 1, email: 'a@example.com' }, { expiresIn: '-1h' });
    await expect(intercodeProfileFromAccessToken(token, getKey)).rejects.toThrow(/exp/);
  });

  it('rejects a token with no email address', async () => {
    const token = await signToken({ id: 1, email: null });
    await expect(intercodeProfileFromAccessToken(token, getKey)).rejects.toThrow(/no email/);
  });
});
