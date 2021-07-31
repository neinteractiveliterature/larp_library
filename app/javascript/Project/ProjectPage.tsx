import { LoadQueryWrapper, useGraphQLConfirm } from '@neinteractiveliterature/litform/lib';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import ProjectHeaders from '../ProjectSearch/ProjectHeaders';
import { generateProjectPath } from '../URLGenerators';
import { useDeleteProjectMutation } from './mutations.generated';
import ProjectFilesSection from './ProjectFilesSection';
import { ProjectLinkDisplay } from './ProjectLinkDisplay';
import { useProjectPageQuery } from './queries.generated';

function useProjectPageQueryFromParam() {
  const { projectId } = useParams();
  return useProjectPageQuery({ variables: { projectId: projectId.replace(/-.*$/, '') } });
}

export default LoadQueryWrapper(useProjectPageQueryFromParam, function ProjectPage({ data }) {
  const { project } = data;
  const confirm = useGraphQLConfirm();
  const [deleteProject] = useDeleteProjectMutation();
  const navigate = useNavigate();

  const hasLinksAndFiles = project.projectLinks.length > 0 && project.projectFiles.length > 0;

  const deleteProjectConfirmed = async () => {
    await deleteProject({ variables: { id: project.id } });
    navigate('/projects', { replace: true });
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
                <Link to={`${generateProjectPath(project)}/edit`} className="btn btn-primary">
                  Edit project
                </Link>
              </li>
            )}
            {project.currentUserCanDelete && (
              <li className="list-inline-item">
                <button
                  type="button"
                  className="btn btn-link text-danger"
                  onClick={() =>
                    confirm({
                      action: deleteProjectConfirmed,
                      prompt: `Are you sure you want to completely delete ${project.title} from Larp Library?  This cannot be undone!`,
                    })
                  }
                >
                  Delete project
                </button>
              </li>
            )}
          </ul>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h2 className="m-0">
                {project.projectFiles.length > 0 && !hasLinksAndFiles ? 'Downloads' : 'Content'}
              </h2>
            </div>
            <div className="card-body">
              <div className="mb-4">
                {hasLinksAndFiles && <h3 className="h4">Links</h3>}
                <ul className="list-unstyled m-0">
                  {project.projectLinks.map((link) => (
                    <li key={link.id}>
                      <ProjectLinkDisplay link={link} />
                    </li>
                  ))}
                </ul>
                {hasLinksAndFiles && (
                  <>
                    <hr />
                    <h3 className="h4">Downloads</h3>
                  </>
                )}
                <ProjectFilesSection project={project} />
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
});
