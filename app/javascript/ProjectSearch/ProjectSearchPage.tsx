import { useQuery } from '@apollo/client';
import React, { useState, type JSX } from 'react';
import { Waypoint } from '../Waypoint';
import { appContext } from '../appContext';
import { loadQuery } from '../loadQuery';
import { ProjectSearchQueryDocument } from './queries.generated';
import ProjectCard from './ProjectCard';
import SimpleProjectSearchControls from './SimpleProjectSearchControls';
import useProjectSearchParams, { decodeProjectSearchParams } from './useProjectSearchParams';
import AdvancedProjectSearchControls from './AdvancedProjectSearchControls';
import { pageTitle } from '../pageTitle';
import type { Route } from './+types/ProjectSearchPage';

enum ProjectSearchMode {
  SIMPLE = 'SIMPLE',
  ADVANCED = 'ADVANCED',
}

export async function clientLoader({ context, request }: Route.ClientLoaderArgs) {
  const { apolloClient } = context.get(appContext);
  // the search lives in the URL, so a new search is a navigation, and the previous results stay up while it loads
  return loadQuery(
    apolloClient,
    ProjectSearchQueryDocument,
    decodeProjectSearchParams(new URL(request.url).searchParams),
  );
}

export default function ProjectSearchPage({ loaderData }: Route.ComponentProps): JSX.Element {
  const [projectSearchParams, setProjectSearchParams] = useProjectSearchParams();
  const [searchMode, setSearchMode] = useState<ProjectSearchMode>(() => {
    if (
      projectSearchParams.title ||
      projectSearchParams.authors ||
      projectSearchParams.playerCountLowerBound ||
      projectSearchParams.playerCountUpperBound ||
      projectSearchParams.facilitatorCountLowerBound ||
      projectSearchParams.facilitatorCountUpperBound
    ) {
      return ProjectSearchMode.ADVANCED;
    }

    return ProjectSearchMode.SIMPLE;
  });

  const switchToSimpleSearch = () => {
    setProjectSearchParams({
      title: undefined,
      authors: undefined,
      playerCountLowerBound: undefined,
      playerCountUpperBound: undefined,
      facilitatorCountLowerBound: undefined,
      facilitatorCountUpperBound: undefined,
    });
    setSearchMode(ProjectSearchMode.SIMPLE);
  };

  // The loader put the first page of results in the Apollo cache.  Reading them back from there is what lets
  // fetchMore page in the rest as the page is scrolled.
  const { data = loaderData, fetchMore } = useQuery(ProjectSearchQueryDocument, { variables: projectSearchParams });

  return (
    <>
      <div className="d-flex flex-column flex-lg-row align-items-lg-center">
        <div className="flex-grow-1">
          <h1>Larps</h1>
        </div>
        {searchMode === ProjectSearchMode.SIMPLE && <SimpleProjectSearchControls data={data} />}
      </div>
      {searchMode === ProjectSearchMode.SIMPLE && (
        <div className="text-start text-lg-end my-2 mt-lg-0">
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => setSearchMode(ProjectSearchMode.ADVANCED)}
          >
            Switch to advanced search
          </button>
        </div>
      )}
      {searchMode === ProjectSearchMode.ADVANCED && (
        <AdvancedProjectSearchControls data={data} switchToSimpleSearch={switchToSimpleSearch} />
      )}

      {data.projects.edges.map(({ node: project }, index) => (
        <React.Fragment key={project.id}>
          <ProjectCard project={project} />
          {index === data.projects.edges.length - 5 && (
            <Waypoint
              onEnter={() => {
                if (data.projects.edges.length < data.projects.totalCount) {
                  fetchMore({
                    variables: {
                      ...projectSearchParams,
                      after: data.projects.pageInfo.endCursor,
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

export const meta = pageTitle('Larps');
