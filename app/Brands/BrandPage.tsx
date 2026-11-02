import { Fragment, useEffect, type JSX } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link, useFetcher, useLocation } from 'react-router';
import { Waypoint } from '../Waypoint';
import ProjectCard from '../ProjectSearch/ProjectCard';
import { generateBrandPath } from '../URLGenerators';
import { formatPageTitle } from '../pageTitle';
import { abilityContext } from '../server/lib/authContext';
import { findBrandPage, type BrandPageData } from '../server/lib/brands.server';
import { readDbContext } from '../server/lib/dbContext';
import { pageUrl, useLoadMorePages } from '../useLoadMorePages';
import UnapprovedBrandAlert from './UnapprovedBrandAlert';
import type { Route } from './+types/BrandPage';

// The same loader serves the pages of projects after the first: the list asks for them with an `offset`.
export async function loader({ context, params, request }: Route.LoaderArgs) {
  const offset = Math.max(0, parseInt(new URL(request.url).searchParams.get('offset') ?? '', 10) || 0);
  return findBrandPage(context.get(readDbContext), context.get(abilityContext), params.brandSlug, { offset });
}

export default function BrandPage({ loaderData }: Route.ComponentProps) {
  const { brand } = loaderData;

  return (
    <>
      <UnapprovedBrandAlert brand={brand} />
      <div className="d-flex">
        <div className="flex-grow-1">
          <h1>{brand.name}</h1>
        </div>
        <div>
          {brand.currentUserCanCreateProjects && (
            <Link to={`${generateBrandPath(brand)}/projects/new`} className="btn btn-success ms-2">
              New project
            </Link>
          )}
          {brand.currentUserCanEdit && (
            <Link to={`${generateBrandPath(brand)}/edit`} className="btn btn-outline-secondary ms-2">
              Admin
            </Link>
          )}
        </div>
      </div>
      <ReactMarkdown>{brand.description ?? ''}</ReactMarkdown>
      <BrandProjects firstPage={loaderData} />
      {brand.currentUserCanCreateProjects && (
        <Link to={`${generateBrandPath(brand)}/projects/new`} className="btn btn-success">
          New project
        </Link>
      )}
    </>
  );
}

/** The brand's projects, the first page from the loader and then, as the end is scrolled toward, the following pages */
function BrandProjects({ firstPage }: { firstPage: BrandPageData }): JSX.Element {
  const location = useLocation();
  const fetcher = useFetcher<typeof loader>();
  const { items: projects, addPage } = useLoadMorePages(firstPage.projects);

  useEffect(() => {
    if (fetcher.data) {
      addPage(fetcher.data.offset, fetcher.data.projects);
    }
  }, [fetcher.data, addPage]);

  const loadNextPage = () => {
    if (projects.length < firstPage.totalCount && fetcher.state === 'idle') {
      void fetcher.load(pageUrl(location, firstPage.offset + projects.length));
    }
  };

  return (
    <>
      {projects.map((project, index) => (
        <Fragment key={project.id}>
          <ProjectCard project={project} />
          {index === projects.length - 5 && <Waypoint onEnter={loadNextPage} />}
        </Fragment>
      ))}
    </>
  );
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: formatPageTitle(loaderData?.brand.name) }];
}
