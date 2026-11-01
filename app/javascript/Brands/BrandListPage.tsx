import { PageLoadingIndicator, ErrorDisplay } from '@neinteractiveliterature/litform';
import React, { type JSX } from 'react';
import { Waypoint } from '../Waypoint';
import BrandCard from './BrandCard';
import { useBrandsPageQuery } from './queries.generated';
import { pageTitle } from '../pageTitle';

export default function BrandListPage(): JSX.Element {
  const { data, loading, error, fetchMore } = useBrandsPageQuery();

  return (
    <>
      <h1>Larp creators</h1>

      <ErrorDisplay graphQLError={error} />
      <PageLoadingIndicator visible={loading} iconSet="bootstrap-icons" />

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

export const meta = pageTitle('Larp creators');
