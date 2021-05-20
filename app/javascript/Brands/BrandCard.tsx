import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { MarkdownLink } from '../MarkdownLink';
import { generateBrandPath } from '../URLGenerators';
import { Brand, ProjectConnection } from '../graphqlTypes.generated';

export type BrandCardProps = {
  brand: Pick<Brand, 'name' | 'description' | 'slug'> & {
    projects: Pick<ProjectConnection, 'totalCount'>;
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
              ({brand.projects.totalCount} {brand.projects.totalCount === 1 ? 'larp' : 'larps'})
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
