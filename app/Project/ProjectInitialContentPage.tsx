import { Link } from 'react-router';
import { pageTitle } from '~/pageTitle';
import { abilityContext } from '~/server/lib/authContext';
import { readDbContext } from '~/server/lib/dbContext';
import { findProjectPage } from '~/server/lib/projects.server';
import { generateProjectPath } from '~/URLGenerators';
import ProjectContentFields from '~/Project/ProjectContentFields';
import type { Route } from './+types/ProjectInitialContentPage';

export function loader({ context, params }: Route.LoaderArgs) {
  return findProjectPage(context.get(readDbContext), context.get(abilityContext), params.projectId, { editing: true });
}

export default function ProjectInitialContentPage({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <h1>Content</h1>
      <ProjectContentFields project={loaderData.project} />
      <div className="mt-4">
        <Link to={generateProjectPath(loaderData.project)} className="btn btn-primary">
          Finish and go to project page
        </Link>
      </div>
    </>
  );
}

export const meta = pageTitle('Add content');
