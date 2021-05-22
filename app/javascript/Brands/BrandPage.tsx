import { ErrorDisplay, LoadingIndicator } from '@neinteractiveliterature/litform';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Waypoint } from 'react-waypoint';
import ProjectCard from '../ProjectSearch/ProjectCard';
import { generateBrandPath } from '../URLGenerators';
import { useBrandPageQuery } from './queries.generated';
import UnapprovedBrandAlert from './UnapprovedBrandAlert';

export default function BrandPage(): JSX.Element {
  const { brandSlug } = useParams();
  const { data, loading, error, fetchMore } = useBrandPageQuery({
    variables: {
      slug: brandSlug,
    },
  });

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { brand } = data!;

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
            <Link
              to={`${generateBrandPath(brand)}/edit`}
              className="btn btn-outline-secondary ms-2"
            >
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
                      slug: brandSlug,
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
