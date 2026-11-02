import { Fragment, useEffect, type JSX } from 'react';
import { useFetcher, useLocation } from 'react-router';
import { pageTitle } from '~/lib/pageTitle';
import { userContext } from '~/.server/lib/authContext';
import { listBrands, type BrandListPageData } from '~/.server/lib/brands.server';
import { readDbContext } from '~/.server/lib/dbContext';
import { pageUrl, useLoadMorePages } from '~/lib/useLoadMorePages';
import { Waypoint } from '~/components/Waypoint';
import BrandCard from '~/components/brands/BrandCard';
import type { Route } from './+types/BrandListPage';

// The same loader serves the pages after the first: the list asks for them with an `offset`.
export async function loader({ context, request }: Route.LoaderArgs) {
  const offset = Math.max(0, parseInt(new URL(request.url).searchParams.get('offset') ?? '', 10) || 0);
  return listBrands(context.get(readDbContext), context.get(userContext), { offset });
}

export default function BrandListPage({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <h1>Larp creators</h1>
      <BrandList firstPage={loaderData} />
    </>
  );
}

/** The brands, the first page from the loader and then, as the end is scrolled toward, the following pages */
function BrandList({ firstPage }: { firstPage: BrandListPageData }): JSX.Element {
  const location = useLocation();
  const fetcher = useFetcher<typeof loader>();
  const { items: brands, addPage } = useLoadMorePages(firstPage.brands);

  useEffect(() => {
    if (fetcher.data) {
      addPage(fetcher.data.offset, fetcher.data.brands);
    }
  }, [fetcher.data, addPage]);

  const loadNextPage = () => {
    if (brands.length < firstPage.totalCount && fetcher.state === 'idle') {
      void fetcher.load(pageUrl(location, firstPage.offset + brands.length));
    }
  };

  return (
    <>
      {brands.map((brand, index) => (
        <Fragment key={brand.id}>
          <BrandCard brand={brand} />
          {index === brands.length - 5 && <Waypoint onEnter={loadNextPage} />}
        </Fragment>
      ))}
    </>
  );
}

export const meta = pageTitle('Larp creators');
