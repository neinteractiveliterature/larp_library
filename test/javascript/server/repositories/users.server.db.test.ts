// @vitest-environment node
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { findUserById, listAdminsWithEmail } from '~/server/repositories/users.server';
import { db, resetDb, rollbackDb, setupDb, stubDbTransactions, teardownDb } from '../support/db';
import { createUser } from '../support/factories';

describe('users repository', () => {
  beforeAll(async () => {
    await setupDb();
    stubDbTransactions();
  });
  afterAll(teardownDb);
  beforeEach(resetDb);
  afterEach(rollbackDb);

  describe('findUserById', () => {
    it('finds a user by id, whether the id is a number or a string (as better-auth passes them)', async () => {
      const user = await createUser({ name: 'Findable' });

      expect((await findUserById(db, user.id))?.name).toEqual('Findable');
      expect((await findUserById(db, String(user.id)))?.name).toEqual('Findable');
    });

    it('returns null for an id that is not a whole number, or that nobody has', async () => {
      expect(await findUserById(db, 'abc')).toBeNull();
      expect(await findUserById(db, '1.5')).toBeNull();
      expect(await findUserById(db, 987654)).toBeNull();
    });
  });

  describe('listAdminsWithEmail', () => {
    it('lists the administrators who have an email address, and no one else', async () => {
      const admin = await createUser({ admin: true });
      await createUser({ admin: true, email: null });
      await createUser({ admin: false });

      expect((await listAdminsWithEmail(db)).map((user) => user.id)).toEqual([admin.id]);
    });
  });
});
