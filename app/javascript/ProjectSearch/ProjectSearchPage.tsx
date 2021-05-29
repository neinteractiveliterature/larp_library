import { PageLoadingIndicator } from '@neinteractiveliterature/litform/lib';
import { ErrorDisplay } from '@neinteractiveliterature/litform/lib';
import React, { useState } from 'react';
import { Waypoint } from 'react-waypoint';
import { useProjectSearchQuery } from './queries.generated';
import ProjectCard from './ProjectCard';
import SimpleProjectSearchControls from './SimpleProjectSearchControls';
import useProjectSearchParams from './useProjectSearchParams';
import AdvancedProjectSearchControls from './AdvancedProjectSearchControls';

enum ProjectSearchMode {
  SIMPLE = 'SIMPLE',
  ADVANCED = 'ADVANCED',
}

export default function ProjectSearchPage(): JSX.Element {
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

  const { data, loading, error, fetchMore } = useProjectSearchQuery({
    variables: projectSearchParams,
    fetchPolicy: 'network-only',
  });

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

      <ErrorDisplay graphQLError={error} />
      <div className="position-absolute">
        <PageLoadingIndicator visible={loading} />
      </div>

      {!error &&
        !loading &&
        data &&
        data.projects.edges.map(({ node: project }, index) => (
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
