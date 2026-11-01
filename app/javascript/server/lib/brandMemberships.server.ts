import { randomBytes } from 'node:crypto';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db as realDb, type DbOrTx, type ReadDb } from '../db';
import { brandMemberships, brands } from '../db/schema';
import { failure, type ActionResult } from './actionResult.server';
import type { AuthUser } from './authContext';
import { brandMembershipSubject, requireAbility, type AppAbility } from './authorization.server';
import { sendBrandInvitationEmail, type MailTransport } from './brandMail.server';

function notFound(): never {
  throw new Response(null, { status: 404, statusText: 'Not Found' });
}

const invitation = z.object({
  email: z.string().trim().email('Email is invalid'),
  admin: z.boolean(),
});

/** A URL-safe token like the ones Devise's `friendly_token` made: 20 characters, impossible to guess */
function generateInvitationToken(): string {
  return randomBytes(15).toString('base64url');
}

/**
 * Invites someone, by email address, to join a brand, as a member or as an administrator. The membership has no user until
 * the invitation is accepted, and its token (which is in the link emailed to them) is what proves it's theirs.
 */
export async function inviteBrandMember(
  ability: AppAbility,
  invitedBy: Pick<AuthUser, 'id' | 'name' | 'email'> | null,
  brandId: unknown,
  input: unknown,
  { db = realDb, transport }: { db?: DbOrTx; transport?: MailTransport } = {},
): Promise<ActionResult<{ brandMembership: { id: number } }>> {
  if (typeof brandId !== 'number' || !Number.isInteger(brandId)) {
    notFound();
  }
  const brand = await db.query.brands.findFirst({ where: eq(brands.id, brandId) });
  if (!brand) {
    notFound();
  }
  requireAbility(ability, 'create', brandMembershipSubject({ brandId }));

  const parsed = invitation.safeParse(input);
  if (!parsed.success) {
    return failure(...parsed.error.issues.map((issue) => issue.message));
  }

  const invitationToken = generateInvitationToken();
  const [membership] = await db
    .insert(brandMemberships)
    .values({ brandId, admin: parsed.data.admin, invitationEmail: parsed.data.email, invitationToken })
    .returning({ id: brandMemberships.id });

  // (Rails sent this twice: once from the model's callback and once from the mutation)
  await sendBrandInvitationEmail({ ...parsed.data, invitationToken }, brand, invitedBy, { transport });
  return { ok: true, brandMembership: membership };
}

/** Removes a member or cancels an invitation */
export async function removeBrandMembership(
  ability: AppAbility,
  membershipId: unknown,
  { db = realDb }: { db?: DbOrTx } = {},
): Promise<void> {
  if (typeof membershipId !== 'number' || !Number.isInteger(membershipId)) {
    notFound();
  }
  const membership = await db.query.brandMemberships.findFirst({ where: eq(brandMemberships.id, membershipId) });
  if (!membership) {
    notFound();
  }
  requireAbility(ability, 'delete', brandMembershipSubject(membership));

  await db.delete(brandMemberships).where(eq(brandMemberships.id, membershipId));
}

export type InvitationData = {
  brandMembership: { id: number; admin: boolean; brand: { id: number; name: string; slug: string } };
};

/** The invitation with this token to the brand with this slug, for the page that lets its holder accept it */
export async function findInvitation(db: ReadDb, brandSlug: string, invitationToken: string): Promise<InvitationData> {
  const brand = await db.query.brands.findFirst({ where: eq(brands.slug, brandSlug) });
  const membership =
    brand &&
    (await db.query.brandMemberships.findFirst({
      where: and(eq(brandMemberships.brandId, brand.id), eq(brandMemberships.invitationToken, invitationToken)),
    }));
  if (!brand || !membership) {
    notFound();
  }

  return {
    brandMembership: {
      id: membership.id,
      admin: membership.admin === true,
      brand: { id: brand.id, name: brand.name, slug: brand.slug },
    },
  };
}

/**
 * Accepts an invitation on behalf of the signed-in user, who becomes the member it was for. The token is used up, so the
 * invitation link can't be used again.
 */
export async function acceptInvitation(
  user: Pick<AuthUser, 'id'> | null,
  input: { brandId: unknown; invitationToken: unknown },
  { db = realDb }: { db?: DbOrTx } = {},
): Promise<ActionResult<{ brandMembership: { id: number } }>> {
  if (!user) {
    throw new Response('Sign in to accept an invitation', { status: 403, statusText: 'Forbidden' });
  }
  const { brandId, invitationToken } = input;
  if (typeof brandId !== 'number' || typeof invitationToken !== 'string') {
    notFound();
  }

  return db.transaction(async (tx) => {
    const membership = await tx.query.brandMemberships.findFirst({
      where: and(eq(brandMemberships.brandId, brandId), eq(brandMemberships.invitationToken, invitationToken)),
    });
    if (!membership) {
      notFound();
    }

    const alreadyMember = await tx.query.brandMemberships.findFirst({
      where: and(eq(brandMemberships.brandId, brandId), eq(brandMemberships.userId, user.id)),
    });
    if (alreadyMember) {
      return failure('User is already a member of this brand');
    }

    await tx
      .update(brandMemberships)
      .set({ userId: user.id, invitationToken: null })
      .where(eq(brandMemberships.id, membership.id));
    return { ok: true as const, brandMembership: { id: membership.id } };
  });
}
