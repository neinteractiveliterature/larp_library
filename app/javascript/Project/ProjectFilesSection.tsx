import { Project } from '../graphqlTypes.generated';
import ProjectFile from './ProjectFile';
import { ProjectFileFieldsFragment } from './queries.generated';

export type ProjectFilesSectionProps = {
  project: Pick<Project, 'id' | 'currentUserCanUploadFiles' | 'currentUserCanDeleteFiles'> & {
    projectFiles: ProjectFileFieldsFragment[];
  };
};

function ProjectFilesSection(props: ProjectFilesSectionProps): JSX.Element {
  const { project } = props;

  return (
    <>
      <ul className="list-unstyled">
        {props.project.projectFiles.map((file) => (
          <ProjectFile file={file} project={project} key={file.id} />
        ))}
      </ul>
    </>
  );
}

export default ProjectFilesSection;
