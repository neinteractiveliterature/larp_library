import type { JSX } from 'react';
import { Link } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { MarkdownLink } from '~/MarkdownLink';
import { generateBrandPath } from '~/URLGenerators';

export type BrandCardProps = {
  brand: {
    name: string;
    description: string | null;
    slug: string;
    projectCount: number;
  };
};

export default function BrandCard({ brand }: BrandCardProps): JSX.Element {
  return (
    <>
      <div className="card mb-2">
        <div className="card-header">
          <h2 className="m-0">
            <Link to={generateBrandPath(brand)} className="link-unstyled">
              {brand.name}
            </Link>{' '}
            <small>
              ({brand.projectCount} {brand.projectCount === 1 ? 'larp' : 'larps'})
            </small>
          </h2>
        </div>
        <div className="card-body">
          <ReactMarkdown components={{ a: MarkdownLink }}>
            {(brand.description ?? '').slice(0, 500) +
              (brand.description && brand.description.length >= 500
                ? `[... (read more)](${generateBrandPath(brand)})`
                : '')}
          </ReactMarkdown>
        </div>
      </div>
    </>
  );
}
