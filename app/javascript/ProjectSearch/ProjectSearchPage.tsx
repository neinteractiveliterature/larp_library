import { PageLoadingIndicator } from '@neinteractiveliterature/litform/lib';
import { ErrorDisplay } from '@neinteractiveliterature/litform/lib';
import { SearchInput, useDebouncedState } from '@neinteractiveliterature/litform/lib';
import React, { useState } from 'react';
import { Waypoint } from 'react-waypoint';
import { useProjectSearchQuery } from './queries.generated';
import ProjectCard from './ProjectCard';

export default function ProjectSearchPage(): JSX.Element {
  const [queryString, setQueryString] = useState('');
  const [transientQueryString, setTransientQueryString] = useDebouncedState(
    '',
    (newValue) => setQueryString(newValue),
    250,
  );
  const { data, loading, error, fetchMore } = useProjectSearchQuery({
    variables: { queryString },
    fetchPolicy: 'network-only',
  });

  return (
    <>
      <div className="d-flex flex-direction-column flex-direction-lg-row">
        <div className="flex-grow-1">
          <h1>Larps</h1>
        </div>
        <div style={{ minWidth: '150px', width: '33%' }}>
          <SearchInput
            label="Search"
            value={transientQueryString}
            onChange={setTransientQueryString}
          />
        </div>
      </div>

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
