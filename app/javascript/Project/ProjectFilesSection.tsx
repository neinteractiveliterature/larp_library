import { Project } from '../graphqlTypes.generated';
import ProjectFile from './ProjectFile';
import { ProjectFileFieldsFragment } from './queries.generated';
import S3Upload, { S3UploadProps } from './S3Upload';

export type ProjectFilesSectionProps = Omit<S3UploadProps, 'projectId'> & {
  project: Pick<Project, 'id' | 'currentUserCanUploadFiles' | 'currentUserCanDeleteFiles'> & {
    projectFiles: ProjectFileFieldsFragment[];
  };
};

function ProjectFilesSection(props: ProjectFilesSectionProps): JSX.Element {
  const { project, ...s3UploadProps } = props;

  return (
    <>
      <ul className="list-unstyled">
        {props.project.projectFiles.map((file) => (
          <ProjectFile file={file} project={project} key={file.id} />
        ))}
      </ul>

      {project.currentUserCanUploadFiles && <S3Upload project={project} {...s3UploadProps} />}
    </>
  );
}

export default ProjectFilesSection;
