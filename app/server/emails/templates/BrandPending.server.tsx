import { ActionButton } from '../components/ActionButton.server';
import { Layout } from '../components/Layout.server';
import { Paragraph } from '../components/Paragraph.server';

export type BrandPendingProps = {
  brandName: string;
  creatorName: string;
  reviewUrl: string;
};

/** Sent to the site's admins when someone creates a brand that needs approval. */
export function BrandPending({ brandName, creatorName, reviewUrl }: BrandPendingProps) {
  return (
    <Layout previewText={`New brand for approval: ${brandName}`}>
      <Paragraph>
        {creatorName} has submitted a brand called {brandName} for approval on Larp Library.
      </Paragraph>
      <ActionButton href={reviewUrl}>Accept or reject it</ActionButton>
    </Layout>
  );
}
