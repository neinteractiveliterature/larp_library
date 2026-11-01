import { Fragment, useEffect, useState, type JSX } from 'react';
import { useFetcher, useLocation } from 'react-router';
import { Waypoint } from '../Waypoint';
import { pageTitle } from '../pageTitle';
import { readDbContext } from '../server/lib/dbContext';
import {
  findTagByName,
  searchProjects,
  type ProjectSearchPage as ProjectSearchPageData,
  type ProjectSearchResult,
} from '../server/lib/projectSearch.server';
import ProjectCard from './ProjectCard';
import SimpleProjectSearchControls from './SimpleProjectSearchControls';
import { decodeProjectSearchParams } from './projectSearchParams';
import useProjectSearchParams from './useProjectSearchParams';
import AdvancedProjectSearchControls from './AdvancedProjectSearchControls';
import type { Route } from './+types/ProjectSearchPage';

enum ProjectSearchMode {
  SIMPLE = 'SIMPLE',
  ADVANCED = 'ADVANCED',
}

// The search lives in the URL, so a new search is a navigation, and the previous results stay up while it loads. The same
// loader serves the pages after the first: the results page asks for them with an `offset`.
export async function loader({ context, request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const params = decodeProjectSearchParams(url.searchParams);
  const offset = Math.max(0, parseInt(url.searchParams.get('offset') ?? '', 10) || 0);
  const db = context.get(readDbContext);

  const [page, tag] = await Promise.all([searchProjects(db, params, { offset }), findTagByName(db, params.tag)]);
  return { ...page, tag };
}

export default function ProjectSearchPage({ loaderData }: Route.ComponentProps): JSX.Element {
  const location = useLocation();
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

  return (
    <>
      <div className="d-flex flex-column flex-lg-row align-items-lg-center">
        <div className="flex-grow-1">
          <h1>Larps</h1>
        </div>
        {searchMode === ProjectSearchMode.SIMPLE && <SimpleProjectSearchControls tag={loaderData.tag} />}
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
        <AdvancedProjectSearchControls tag={loaderData.tag} switchToSimpleSearch={switchToSimpleSearch} />
      )}

      {/* keyed by the search, so the pages scrolled in for one search are dropped when it changes */}
      <ProjectSearchResults key={location.search} firstPage={loaderData} />
    </>
  );
}

export const meta = pageTitle('Larps');

/** The results, the first page from the loader and then, as the end is scrolled toward, the following pages */
function ProjectSearchResults({ firstPage }: { firstPage: ProjectSearchPageData }): JSX.Element {
  const location = useLocation();
  const fetcher = useFetcher<typeof loader>();
  const [laterPages, setLaterPages] = useState<Record<number, ProjectSearchResult[]>>({});

  useEffect(() => {
    if (fetcher.data) {
      const { offset, projects } = fetcher.data;
      setLaterPages((pages) => ({ ...pages, [offset]: projects }));
    }
  }, [fetcher.data]);

  const projects = [
    ...firstPage.projects,
    ...Object.entries(laterPages)
      .sort(([a], [b]) => Number(a) - Number(b))
      .flatMap(([, page]) => page),
  ];

  const loadNextPage = () => {
    if (projects.length >= firstPage.totalCount || fetcher.state !== 'idle') {
      return;
    }
    const params = new URLSearchParams(location.search);
    params.set('offset', String(firstPage.offset + projects.length));
    void fetcher.load(`/projects?${params.toString()}`);
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
