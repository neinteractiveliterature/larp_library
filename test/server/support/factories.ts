import { brandMemberships, brands, projects, users } from '~/.server/db/schema';
import { db } from './db';

// Small helpers for the rows tests need, so a test can say what matters to it and leave the rest to defaults.

let counter = 0;
const next = () => ++counter;

export async function createUser(values: Partial<typeof users.$inferInsert> = {}) {
  const n = next();
  const [user] = await db
    .insert(users)
    .values({ name: `User ${n}`, email: `user${n}@example.com`, ...values })
    .returning();
  return user;
}

export async function createBrand(values: Partial<typeof brands.$inferInsert> = {}) {
  const n = next();
  const [brand] = await db
    .insert(brands)
    .values({ name: `Brand ${n}`, slug: `brand-${n}`, approved: true, ...values })
    .returning();
  return brand;
}

export async function createProject(brandId: number, values: Partial<typeof projects.$inferInsert> = {}) {
  const [project] = await db
    .insert(projects)
    .values({ title: `Project ${next()}`, brandId, ...values })
    .returning();
  return project;
}

export async function addMember(brandId: number, userId: number, admin = false) {
  const [membership] = await db.insert(brandMemberships).values({ brandId, userId, admin }).returning();
  return membership;
}

/** The status of the Response a promise rejected with (the way server functions refuse), or null if it didn't reject */
export async function responseStatus(promise: Promise<unknown>) {
  try {
    await promise;
  } catch (error) {
    return error instanceof Response ? error.status : error;
  }
  return null;
}
