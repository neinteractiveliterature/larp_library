// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { renderEmail } from '~/server/emails/render';
import { sendTemplatedMail } from '~/server/emails/send';
import { BrandApproved } from '~/server/emails/templates/BrandApproved.server';
import { BrandMembershipInvitation } from '~/server/emails/templates/BrandMembershipInvitation.server';
import { BrandPending } from '~/server/emails/templates/BrandPending.server';

describe('BrandPending', () => {
  it('names the brand and its creator and links to the review page', async () => {
    const { html, text } = await renderEmail(
      <BrandPending brandName="Cool Games" creatorName="Pat Smith" reviewUrl="https://example.com/brands/unapproved" />,
    );
    expect(text).toContain('Pat Smith has submitted a brand called Cool Games for approval');
    expect(html).toContain('href="https://example.com/brands/unapproved"');
  });
});

describe('BrandApproved', () => {
  it('links to the brand', async () => {
    const { html, text } = await renderEmail(
      <BrandApproved brandName="Cool Games" brandUrl="https://example.com/brands/cool-games" />,
    );
    expect(text).toContain('Your brand, Cool Games, has been approved');
    expect(html).toContain('href="https://example.com/brands/cool-games"');
  });
});

describe('BrandMembershipInvitation', () => {
  const acceptUrl = 'https://example.com/brands/cool-games/invitations/abc';

  it('mentions who sent the invitation, and lists only member permissions for a non-admin', async () => {
    const { text } = await renderEmail(
      <BrandMembershipInvitation
        brandName="Cool Games"
        invitingUserName="Pat Smith"
        admin={false}
        acceptUrl={acceptUrl}
      />,
    );
    expect(text).toContain('Pat Smith has invited you to join Cool Games');
    expect(text).toContain('Publish larps as Cool Games');
    expect(text).not.toContain('Add and remove members');
    expect(text).toContain('let Pat Smith know');
  });

  it('lists the admin permissions, with the brand name filled in, for an admin invitation', async () => {
    const { text } = await renderEmail(
      <BrandMembershipInvitation brandName="Cool Games" invitingUserName="Pat Smith" admin acceptUrl={acceptUrl} />,
    );
    expect(text).toContain('Add and remove members from Cool Games');
    expect(text).toContain('Edit the public description and branding for Cool Games');
  });

  it("doesn't fall over when the inviting user is unknown", async () => {
    const { html, text } = await renderEmail(
      <BrandMembershipInvitation brandName="Cool Games" invitingUserName={null} admin={false} acceptUrl={acceptUrl} />,
    );
    expect(text).toContain("You've been invited to join Cool Games");
    expect(text).not.toContain('let  know');
    expect(html).toContain(`href="${acceptUrl}"`);
  });
});

describe('sendTemplatedMail', () => {
  it('sends the rendered html and text from the Larp Library address', async () => {
    const sendMail = vi.fn().mockResolvedValue(undefined);
    await sendTemplatedMail({
      transport: { sendMail },
      to: 'a@example.com',
      subject: 'Subject',
      element: <BrandApproved brandName="Cool Games" brandUrl="https://example.com/b" />,
    });
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'Larp Library <noreply@larplibrary.org>',
        to: 'a@example.com',
        subject: 'Subject',
        html: expect.stringContaining('Cool Games'),
        text: expect.stringContaining('Cool Games'),
      }),
    );
  });
});
