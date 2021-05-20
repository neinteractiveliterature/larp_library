import { PageLoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';
import React from 'react';
import { Waypoint } from 'react-waypoint';
import BrandCard from './BrandCard';
import { useBrandsPageQuery } from './queries.generated';

export default function BrandListPage(): JSX.Element {
  const { data, loading, error, fetchMore } = useBrandsPageQuery();

  return (
    <>
      <h1>Larp creators</h1>

      <ErrorDisplay graphQLError={error} />
      <div className="position-absolute">
        <PageLoadingIndicator visible={loading} />
      </div>

      {!error && !loading && data && (
        <>
          {data.brands.edges.map(({ node: brand }, index) => (
            <React.Fragment key={brand.id}>
              <BrandCard brand={brand} />

              {index === data.brands.edges.length - 5 && (
                <Waypoint
                  onEnter={() => {
                    if (data.brands.edges.length < data.brands.totalCount) {
                      fetchMore({
                        variables: {
                          after: data.brands.pageInfo.endCursor,
                        },
                      });
                    }
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </>
      )}
    </>
  );
}
