import { ActionButton } from '~/.server/emails/components/ActionButton.server';
import { Layout } from '~/.server/emails/components/Layout.server';
import { Paragraph } from '~/.server/emails/components/Paragraph.server';

export type BrandApprovedProps = {
  brandName: string;
  brandUrl: string;
};

/** Sent to a brand's creator once an admin approves it. */
export function BrandApproved({ brandName, brandUrl }: BrandApprovedProps) {
  return (
    <Layout previewText={`${brandName} is approved on Larp Library!`}>
      <Paragraph>
        Your brand, {brandName}, has been approved by an administrator. You can now publish your larps.
      </Paragraph>
      <ActionButton href={brandUrl}>Get started</ActionButton>
    </Layout>
  );
}
