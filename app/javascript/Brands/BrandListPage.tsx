import React from 'react';
import { appContext } from '../appContext';
import { loadQuery } from '../loadQuery';
import { pageTitle } from '../pageTitle';
import { Waypoint } from '../Waypoint';
import BrandCard from './BrandCard';
import {
  BrandsPageQueryDocument,
  useBrandsPageQuery,
  type BrandsPageQueryData,
  type BrandsPageQueryVariables,
} from './queries.generated';
import type { Route } from './+types/BrandListPage';

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const { apolloClient } = context.get(appContext);
  return loadQuery<BrandsPageQueryData, BrandsPageQueryVariables>(apolloClient, BrandsPageQueryDocument);
}

export default function BrandListPage({ loaderData }: Route.ComponentProps) {
  // the loader fetched the first page into the Apollo cache; reading it back from there is what lets fetchMore work
  const { data = loaderData, fetchMore } = useBrandsPageQuery();

  return (
    <>
      <h1>Larp creators</h1>

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
  );
}

export const meta = pageTitle('Larp creators');
