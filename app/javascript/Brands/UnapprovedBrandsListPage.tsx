import { ErrorDisplay, useGraphQLConfirm } from '@neinteractiveliterature/litform';
import sortBy from 'lodash/sortBy';
import { useMemo } from 'react';
import { Link, useFetcher } from 'react-router';
import { appContext } from '../appContext';
import { loadQuery } from '../loadQuery';
import { getApolloActionError, withApolloErrors } from '../actionHelpers';
import { pageTitle } from '../pageTitle';
import { generateBrandPath } from '../URLGenerators';
import { ApproveBrandDocument } from './mutations.generated';
import { UnapprovedBrandsListPageQueryDocument } from './queries.generated';
import type { Route } from './+types/UnapprovedBrandsListPage';

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const { apolloClient } = context.get(appContext);
  return loadQuery(apolloClient, UnapprovedBrandsListPageQueryDocument);
}

export async function clientAction({ context, request }: Route.ClientActionArgs) {
  const { apolloClient } = context.get(appContext);
  const { brandId } = (await request.json()) as { brandId: string };

  // React Router reloads the list afterward, so the approved brand drops off it
  return withApolloErrors(async () => {
    await apolloClient.mutate({ mutation: ApproveBrandDocument, variables: { id: brandId } });
    return null;
  });
}

export default function UnapprovedBrandsListPage({ loaderData: data }: Route.ComponentProps) {
  const approveFetcher = useFetcher<typeof clientAction>();
  const sortedBrands = useMemo(
    () =>
      sortBy(
        data.brands.edges.map((edge) => edge.node),
        (brand) => brand.name,
      ),
    [data.brands],
  );
  const confirm = useGraphQLConfirm();

  const approveBrandConfirmed = async (brand: (typeof sortedBrands)[number]) => {
    await approveFetcher.submit({ brandId: brand.id }, { method: 'post', encType: 'application/json' });
  };

  return (
    <>
      <h1>Brands pending approval</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Creator</th>
            <th>Created at</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sortedBrands.map((brand) => (
            <tr key={brand.id}>
              <td>
                <Link to={generateBrandPath(brand)}>{brand.name}</Link>
              </td>
              <td>
                {brand.creator && (
                  <>
                    {brand.creator.name} (<a href={`mailto:${brand.creator.email}`}>{brand.creator.email}</a>)
                  </>
                )}
              </td>
              <td>
                {new Intl.DateTimeFormat(undefined, {
                  dateStyle: 'long',
                  timeStyle: 'long',
                }).format(new Date(brand.createdAt))}
              </td>
              <td>
                <button
                  className="btn btn-success"
                  type="button"
                  disabled={approveFetcher.state !== 'idle'}
                  onClick={() =>
                    confirm({
                      prompt: `Approve “${brand.name}”?  Their content will become immediately
                      visible.`,
                      action: () => approveBrandConfirmed(brand),
                    })
                  }
                >
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ErrorDisplay graphQLError={getApolloActionError(approveFetcher.data)} />
    </>
  );
}

export const meta = pageTitle('Pending creators');
