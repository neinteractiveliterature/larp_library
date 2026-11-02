import { useConfirm } from '@neinteractiveliterature/litform';
import ReactMarkdown from 'react-markdown';
import { Link, redirect, useFetcher } from 'react-router';
import ActionErrorDisplay from '~/components/ActionErrorDisplay';
import { formatPageTitle } from '~/lib/pageTitle';
import ProjectHeaders from '~/components/project-search/ProjectHeaders';
import { abilityContext } from '~/server/lib/authContext';
import { readDbContext } from '~/server/lib/dbContext';
import { deleteProject, findProjectPage, projectIdFromParam } from '~/server/lib/projects.server';
import { generateProjectPath } from '~/lib/URLGenerators';
import ProjectFileDisplay from '~/components/project/ProjectFileDisplay';
import { ProjectLinkDisplay } from '~/components/project/ProjectLinkDisplay';
import type { Route } from './+types/ProjectPage';

export function loader({ context, params }: Route.LoaderArgs) {
  return findProjectPage(context.get(readDbContext), context.get(abilityContext), params.projectId);
}

export async function action({ context, params }: Route.ActionArgs) {
  await deleteProject(context.get(abilityContext), projectIdFromParam(params.projectId));
  return redirect('/projects');
}

export default function ProjectPage({ loaderData }: Route.ComponentProps) {
  const { project } = loaderData;
  const confirm = useConfirm();
  const deleteFetcher = useFetcher<typeof action>();

  // (the loader gives the files and links in the order they're shown)
  const sortedFiles = project.projectFiles;
  const sortedLinks = project.projectLinks;

  const hasLinksAndFiles = project.projectLinks.length > 0 && project.projectFiles.length > 0;

  const deleteProjectConfirmed = async () => {
    await deleteFetcher.submit(null, { method: 'post' });
  };

  return (
    <>
      <div className="row">
        <div className="col-md-8">
          <header className="mb-4">
            <ProjectHeaders project={project} />
          </header>
          <ReactMarkdown>{project.description ?? ''}</ReactMarkdown>
          <ul className="list-inline">
            {project.currentUserCanEdit && (
              <li className="list-inline-item">
                <Link to={`${generateProjectPath(project)}/edit#properties`} className="btn btn-primary">
                  Edit project
                </Link>
              </li>
            )}
            {project.currentUserCanDelete && (
              <li className="list-inline-item">
                <button
                  type="button"
                  className="btn btn-link text-danger"
                  disabled={deleteFetcher.state !== 'idle'}
                  onClick={() =>
                    confirm({
                      action: deleteProjectConfirmed,
                      prompt: `Are you sure you want to completely delete ${project.title} from Larp Library?  This cannot be undone!`,
                    })
                  }
                >
                  Delete project
                </button>
                <ActionErrorDisplay data={deleteFetcher.data} />
              </li>
            )}
          </ul>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <div className="d-flex">
                <h2 className="m-0 flex-grow-1">
                  {project.projectFiles.length > 0 && !hasLinksAndFiles ? 'Downloads' : 'Content'}
                </h2>
                {project.currentUserCanEdit && (
                  <Link to={`${generateProjectPath(project)}/edit#content`} className="btn btn-primary ms-3">
                    Edit
                  </Link>
                )}
              </div>
            </div>
            <div className="card-body">
              <div className="mb-4">
                {hasLinksAndFiles && <h3 className="h4">Downloads</h3>}
                <ul className="list-unstyled">
                  {sortedFiles.map((file) => (
                    <li key={file.id}>
                      <ProjectFileDisplay file={file} />
                    </li>
                  ))}
                </ul>
                {hasLinksAndFiles && (
                  <>
                    <hr />
                    <h3 className="h4">Links</h3>
                  </>
                )}
                <ul className="list-unstyled m-0">
                  {sortedLinks.map((link) => (
                    <li key={link.id}>
                      <ProjectLinkDisplay link={link} />
                    </li>
                  ))}
                </ul>
              </div>

              {project.license && (
                <div className="d-flex align-items-top">
                  {project.license.dedicationHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: project.license.dedicationHtml }} />
                  ) : (
                    <div>
                      This work is licensed under a{' '}
                      <a href={project.license.url} rel="license">
                        {project.license.name}
                      </a>{' '}
                      license.
                    </div>
                  )}
                  {project.license.logoUrl && (
                    <div className="ms-2">
                      <a href={project.license.url} rel="license">
                        <img alt={project.license.name} src={project.license.logoUrl} />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: formatPageTitle(loaderData?.project.title) }];
}
