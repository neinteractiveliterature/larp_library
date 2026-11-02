import { useConfirm } from '@neinteractiveliterature/litform';
import { data, Link, useFetcher } from 'react-router';
import ActionErrorDisplay from '../ActionErrorDisplay';
import { pageTitle } from '../pageTitle';
import { abilityContext } from '../server/lib/authContext';
import { approveBrand, listUnapprovedBrands } from '../server/lib/brands.server';
import { readDbContext } from '../server/lib/dbContext';
import { generateBrandPath } from '../URLGenerators';
import type { Route } from './+types/UnapprovedBrandsListPage';

export async function loader({ context }: Route.LoaderArgs) {
  return { brands: await listUnapprovedBrands(context.get(readDbContext), context.get(abilityContext)) };
}

export async function action({ context, request }: Route.ActionArgs) {
  const { brandId } = await request.json();

  // React Router reloads the list afterward, so the approved brand drops off it
  await approveBrand(context.get(abilityContext), brandId);
  return data(null);
}

export default function UnapprovedBrandsListPage({ loaderData: { brands } }: Route.ComponentProps) {
  const approveFetcher = useFetcher<typeof action>();
  const confirm = useConfirm();

  const approveBrandConfirmed = async (brand: (typeof brands)[number]) => {
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
          {brands.map((brand) => (
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
                }).format(brand.createdAt)}
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
      <ActionErrorDisplay data={approveFetcher.data} />
    </>
  );
}

export const meta = pageTitle('Pending creators');
