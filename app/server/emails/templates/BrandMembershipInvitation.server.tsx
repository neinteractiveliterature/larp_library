import { ActionButton } from '~/server/emails/components/ActionButton.server';
import { Layout } from '~/server/emails/components/Layout.server';
import { Paragraph } from '~/server/emails/components/Paragraph.server';

export type BrandMembershipInvitationProps = {
  brandName: string;
  /** Null when the person who sent the invitation is no longer known */
  invitingUserName: string | null;
  /** Whether the invitation is to be an admin of the brand, not just a member */
  admin: boolean;
  acceptUrl: string;
};

export function BrandMembershipInvitation({
  brandName,
  invitingUserName,
  admin,
  acceptUrl,
}: BrandMembershipInvitationProps) {
  return (
    <Layout previewText={`You've been invited to join ${brandName} on Larp Library`}>
      <Paragraph>
        Larp Library is a site for larp authors to publish their work under free-to-use licenses.{' '}
        {invitingUserName
          ? `${invitingUserName} has invited you to join ${brandName} on Larp Library.`
          : `You've been invited to join ${brandName} on Larp Library.`}
      </Paragraph>
      <Paragraph>This membership allows you to:</Paragraph>
      <ul>
        <li>Publish larps as {brandName}</li>
        <li>Edit existing {brandName} larps</li>
        {admin && (
          <>
            <li>Add and remove members from {brandName}</li>
            <li>Edit the public description and branding for {brandName}</li>
          </>
        )}
      </ul>
      <ActionButton href={acceptUrl}>Accept this invitation</ActionButton>
      <Paragraph>
        If you don&apos;t want to join {brandName}, please just ignore this email
        {invitingUserName ? ` (and possibly let ${invitingUserName} know)` : ''}.
      </Paragraph>
    </Layout>
  );
}
