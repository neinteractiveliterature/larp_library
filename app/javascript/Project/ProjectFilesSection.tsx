import { Project } from '../graphqlTypes.generated';
import ProjectFileDisplay from './ProjectFileDisplay';
import { ProjectFileFieldsFragment } from './queries.generated';

export type ProjectFilesSectionProps = {
  project: Pick<Project, 'id' | 'currentUserCanUploadFiles' | 'currentUserCanDeleteFiles'> & {
    projectFiles: ProjectFileFieldsFragment[];
  };
};

function ProjectFilesSection({ project }: ProjectFilesSectionProps): JSX.Element {
  return (
    <>
      <ul className="list-unstyled">
        {project.projectFiles.map((file) => (
          <ProjectFileDisplay file={file} key={file.id} />
        ))}
      </ul>
    </>
  );
}

export default ProjectFilesSection;
