import type { Transporter } from 'nodemailer';
import { BrandApproved } from '~/.server/emails/templates/BrandApproved.server';
import { BrandMembershipInvitation } from '~/.server/emails/templates/BrandMembershipInvitation.server';
import { BrandPending } from '~/.server/emails/templates/BrandPending.server';
import { sendTemplatedMail } from '~/.server/emails/send';
import { db as realDb, type ReadDb } from '~/.server/db';
import { listAdminsWithEmail } from '~/.server/repositories/users.server';
import { absoluteUrl } from '~/.server/lib/absoluteUrl.server';
import { mailTransport as realMailTransport } from '~/.server/lib/mail.server';

// The emails the brand features send. They go out after the change that caused them has been saved, and a failure to send
// one is logged rather than thrown: by then the brand or the invitation exists, so failing the request would only leave the
// user unsure what happened.

export type MailTransport = Pick<Transporter, 'sendMail'>;

type Person = { name: string; email: string | null };

async function deliverQuietly(description: string, send: () => Promise<void>) {
  try {
    await send();
  } catch (error) {
    console.error(`Could not send the ${description} email`, error);
  }
}

/** Tells every site administrator that a brand is waiting to be approved */
export async function sendBrandPendingEmail(
  brand: { name: string },
  creator: Person | null,
  { db = realDb, transport = realMailTransport }: { db?: ReadDb; transport?: MailTransport } = {},
) {
  await deliverQuietly('brand pending', async () => {
    const admins = await listAdminsWithEmail(db);
    if (admins.length === 0) {
      return;
    }

    await sendTemplatedMail({
      transport,
      to: admins.map((admin) => ({ name: admin.name, address: admin.email! })),
      subject: `New brand for approval on Larp Library: ${brand.name}`,
      element: (
        <BrandPending
          brandName={brand.name}
          creatorName={creator?.name ?? 'Someone'}
          reviewUrl={absoluteUrl('/brands/unapproved')}
        />
      ),
    });
  });
}

/** Tells a brand's creator that an administrator approved it */
export async function sendBrandApprovedEmail(
  brand: { name: string; slug: string },
  creator: Person | null,
  { transport = realMailTransport }: { transport?: MailTransport } = {},
) {
  if (!creator?.email) {
    return;
  }
  const to = { name: creator.name, address: creator.email };

  await deliverQuietly('brand approved', () =>
    sendTemplatedMail({
      transport,
      to,
      subject: `${brand.name} is approved on Larp Library!`,
      element: <BrandApproved brandName={brand.name} brandUrl={absoluteUrl(`/brands/${brand.slug}`)} />,
    }),
  );
}

/** Invites someone, by email address, to join a brand */
export async function sendBrandInvitationEmail(
  invitation: { email: string; admin: boolean; invitationToken: string },
  brand: { name: string; slug: string },
  invitedBy: Person | null,
  { transport = realMailTransport }: { transport?: MailTransport } = {},
) {
  await deliverQuietly('brand invitation', () =>
    sendTemplatedMail({
      transport,
      to: invitation.email,
      subject: invitedBy
        ? `${invitedBy.name} invited you to join ${brand.name} on Larp Library`
        : `You've been invited to join ${brand.name} on Larp Library`,
      element: (
        <BrandMembershipInvitation
          brandName={brand.name}
          invitingUserName={invitedBy?.name ?? null}
          admin={invitation.admin}
          acceptUrl={absoluteUrl(`/brands/${brand.slug}/invitations/${invitation.invitationToken}`)}
        />
      ),
    }),
  );
}
