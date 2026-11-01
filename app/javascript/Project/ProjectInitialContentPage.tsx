import { useQuery } from '@apollo/client';
import { Link } from 'react-router';
import { appContext } from '../appContext';
import { loadQuery } from '../loadQuery';
import { pageTitle } from '../pageTitle';
import { generateProjectPath } from '../URLGenerators';
import ProjectContentFields from './ProjectContentFields';
import { ProjectPageQueryDocument } from './queries.generated';
import type { Route } from './+types/ProjectInitialContentPage';

export async function clientLoader({ context, params }: Route.ClientLoaderArgs) {
  const { apolloClient } = context.get(appContext);
  return loadQuery(apolloClient, ProjectPageQueryDocument, { projectId: params.projectId });
}

export default function ProjectInitialContentPage({ loaderData, params }: Route.ComponentProps) {
  // The loader put the project in the Apollo cache.  Reading it from there (rather than using `loaderData` directly)
  // keeps the file and link lists up to date as files are uploaded and links are added, since those update the cache.
  const { data = loaderData } = useQuery(ProjectPageQueryDocument, { variables: { projectId: params.projectId } });

  return (
    <>
      <h1>Content</h1>
      <ProjectContentFields project={data.project} />
      <div className="mt-4">
        <Link to={generateProjectPath(data.project)} className="btn btn-primary">
          Finish and go to project page
        </Link>
      </div>
    </>
  );
}

export const meta = pageTitle('Add content');
