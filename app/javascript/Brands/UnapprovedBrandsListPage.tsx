import { LoadQueryWrapper, useGraphQLConfirm } from '@neinteractiveliterature/litform';
import sortBy from 'lodash/sortBy';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { generateBrandPath } from '../URLGenerators';
import { useApproveBrandMutation } from './mutations.generated';
import {
  UnapprovedBrandsListPageQueryDocument,
  useUnapprovedBrandsListPageQuery,
} from './queries.generated';

export default LoadQueryWrapper(
  useUnapprovedBrandsListPageQuery,
  function UnapprovedBrandsListPage({ data }) {
    const [approveBrand] = useApproveBrandMutation();
    const sortedBrands = useMemo(
      () =>
        sortBy(
          data.brands.edges.map((edge) => edge.node),
          (brand) => brand.name,
        ),
      [data.brands],
    );
    const confirm = useGraphQLConfirm();

    const approveBrandConfirmed = async (brand: typeof data['brands']['edges'][number]['node']) => {
      await approveBrand({
        variables: { id: brand.id },
        refetchQueries: [{ query: UnapprovedBrandsListPageQueryDocument }],
      });
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
                      {brand.creator.name} (
                      <a href={`mailto:${brand.creator.email}`}>{brand.creator.email}</a>)
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
      </>
    );
  },
);
