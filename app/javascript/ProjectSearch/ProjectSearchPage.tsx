import { PageLoadingIndicator } from '@neinteractiveliterature/litform/lib';
import { ErrorDisplay } from '@neinteractiveliterature/litform/lib';
import { SearchInput, useDebouncedState } from '@neinteractiveliterature/litform/lib';
import React, { useEffect, useMemo, useState } from 'react';
import { Waypoint } from 'react-waypoint';
import { useProjectSearchQuery } from './queries.generated';
import ProjectCard from './ProjectCard';
import { useLocation, useNavigate } from 'react-router';
import Tag from '../Tags/Tag';

function stringPresence(string: string | undefined | null) {
  if (string == null) {
    return undefined;
  }

  if (string.trim().length === 0) {
    return undefined;
  }

  return string;
}

export default function ProjectSearchPage(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const tag = useMemo(() => stringPresence(searchParams.get('tag')), [searchParams]);
  const queryStringFromParams = useMemo(
    () => stringPresence(searchParams.get('q')) ?? '',
    [searchParams],
  );
  const [queryString, setQueryString] = useState(queryStringFromParams);
  const [transientQueryString, setTransientQueryString] = useDebouncedState(
    queryStringFromParams,
    (newValue) => setQueryString(newValue),
    250,
  );
  const searchQueryVariables = useMemo(
    () => ({ queryString, ...(tag ? { tag } : {}) }),
    [queryString, tag],
  );
  const removeTag = () => {
    const newSearch = new URLSearchParams();
    if (stringPresence(queryString)) {
      newSearch.set('q', queryString);
    }
    navigate(`/projects?${newSearch.toString()}`);
  };
  useEffect(() => {
    const newSearch = new URLSearchParams();
    if (stringPresence(queryString)) {
      newSearch.set('q', queryString);
    }
    const tagPresence = stringPresence(tag);
    if (tagPresence) {
      newSearch.set('tag', tagPresence);
    }
    navigate(`/projects?${newSearch.toString()}`, { replace: true });
  }, [navigate, queryString, tag]);

  const { data, loading, error, fetchMore } = useProjectSearchQuery({
    variables: searchQueryVariables,
    fetchPolicy: 'network-only',
  });

  return (
    <>
      <div className="d-flex flex-column flex-lg-row align-items-lg-center">
        <div className="flex-grow-1">
          <h1>Larps</h1>
        </div>
        {data?.tagByName && (
          <div className="me-0 me-lg-2 mb-2 mb-lg-0">
            <Tag tag={data.tagByName} onDismiss={removeTag} />
          </div>
        )}
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
                        ...searchQueryVariables,
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
