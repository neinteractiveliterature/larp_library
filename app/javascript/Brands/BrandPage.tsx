import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router';
import { Waypoint } from '../Waypoint';
import ProjectCard from '../ProjectSearch/ProjectCard';
import { generateBrandPath } from '../URLGenerators';
import { appContext } from '../appContext';
import { loadQuery } from '../loadQuery';
import { formatPageTitle } from '../pageTitle';
import {
  BrandPageQueryDocument,
  useBrandPageQuery,
  type BrandPageQueryData,
  type BrandPageQueryVariables,
} from './queries.generated';
import UnapprovedBrandAlert from './UnapprovedBrandAlert';
import type { Route } from './+types/BrandPage';

export async function clientLoader({ context, params }: Route.ClientLoaderArgs) {
  const { apolloClient } = context.get(appContext);
  return loadQuery<BrandPageQueryData, BrandPageQueryVariables>(apolloClient, BrandPageQueryDocument, {
    slug: params.brandSlug,
  });
}

export default function BrandPage({ loaderData, params }: Route.ComponentProps) {
  // the loader fetched the first page of projects into the Apollo cache; reading it back from there is what lets
  // fetchMore work
  const { data = loaderData, fetchMore } = useBrandPageQuery({ variables: { slug: params.brandSlug } });
  const { brand } = data;

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
      {brand.projects.edges.map(({ node: project }, index) => (
        <React.Fragment key={project.id}>
          <ProjectCard project={project} />
          {index === brand.projects.edges.length - 5 && (
            <Waypoint
              onEnter={() => {
                if (brand.projects.edges.length < brand.projects.totalCount) {
                  fetchMore({
                    variables: {
                      slug: params.brandSlug,
                      projectsAfter: brand.projects.pageInfo.endCursor,
                    },
                  });
                }
              }}
            />
          )}
        </React.Fragment>
      ))}
      {brand.currentUserCanCreateProjects && (
        <Link to={`${generateBrandPath(brand)}/projects/new`} className="btn btn-success">
          New project
        </Link>
      )}
    </>
  );
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: formatPageTitle(loaderData?.brand.name) }];
}
