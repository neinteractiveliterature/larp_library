import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { Project } from '../graphqlTypes.generated';
import { MarkdownLink } from '../MarkdownLink';
import { generateProjectPath } from '../URLGenerators';
import ProjectHeaders, { ProjectHeadersProps } from './ProjectHeaders';

export type ProjectCardProps = {
  project: ProjectHeadersProps['project'] & Pick<Project, 'description'>;
};

export default function ProjectCard({ project }: ProjectCardProps): JSX.Element {
  return (
    <div className="card mb-2">
      <div className="card-header d-flex">
        <div className="flex-grow-1 me-1">
          <ProjectHeaders project={project} />
        </div>
        <div>
          <Link to={generateProjectPath(project)} className="btn btn-secondary">
            View
          </Link>
        </div>
      </div>
      <div className="card-body">
        <ReactMarkdown components={{ a: MarkdownLink }}>
          {(project.description ?? '').slice(0, 500) +
            (project.description && project.description.length >= 500
              ? `[... (read more)](${generateProjectPath(project)})`
              : '')}
        </ReactMarkdown>
      </div>
    </div>
  );
}
