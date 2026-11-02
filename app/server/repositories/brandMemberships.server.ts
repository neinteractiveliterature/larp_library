import { and, asc, eq } from 'drizzle-orm';
import type { DbOrTx, ReadDb } from '~/server/db';
import { brandMemberships } from '~/server/db/schema';

/** Which brands a user belongs to, and whether they administer each. An unaccepted invitation has no user, so isn't here. */
export async function listMembershipsOfUser(db: ReadDb, userId: number) {
  return db
    .select({ brandId: brandMemberships.brandId, admin: brandMemberships.admin })
    .from(brandMemberships)
    .where(eq(brandMemberships.userId, userId));
}

/** A brand's members and pending invitations, in the order they were added, each with its user (if it has one yet) */
export async function listMembershipsOfBrand(db: ReadDb, brandId: number) {
  return db.query.brandMemberships.findMany({
    where: eq(brandMemberships.brandId, brandId),
    with: { user: true },
    orderBy: asc(brandMemberships.id),
  });
}

export async function findMembershipById(db: ReadDb, id: number) {
  return db.query.brandMemberships.findFirst({ where: eq(brandMemberships.id, id) });
}

/** The membership (usually still an invitation) that has this token */
export async function findMembershipByToken(db: ReadDb, brandId: number, invitationToken: string) {
  return db.query.brandMemberships.findFirst({
    where: and(eq(brandMemberships.brandId, brandId), eq(brandMemberships.invitationToken, invitationToken)),
  });
}

export async function findMembershipOfUser(db: ReadDb, brandId: number, userId: number) {
  return db.query.brandMemberships.findFirst({
    where: and(eq(brandMemberships.brandId, brandId), eq(brandMemberships.userId, userId)),
  });
}

/** Makes a user a member of a brand straight away, as when they create it */
export async function insertMember(db: DbOrTx, values: { brandId: number; userId: number; admin: boolean }) {
  await db.insert(brandMemberships).values(values);
}

/** Records an invitation, which has no user until someone accepts it */
export async function insertInvitation(
  db: DbOrTx,
  values: { brandId: number; admin: boolean; invitationEmail: string; invitationToken: string },
) {
  const [membership] = await db.insert(brandMemberships).values(values).returning({ id: brandMemberships.id });
  return membership;
}

/** Gives an invitation to the user who accepted it, using up its token */
export async function claimInvitation(db: DbOrTx, membershipId: number, userId: number) {
  await db.update(brandMemberships).set({ userId, invitationToken: null }).where(eq(brandMemberships.id, membershipId));
}

export async function deleteMembership(db: DbOrTx, id: number) {
  await db.delete(brandMemberships).where(eq(brandMemberships.id, id));
}
