import { Project } from '../graphqlTypes.generated';
import ProjectFile from './ProjectFile';
import { ProjectFileFieldsFragment } from './queries.generated';
import S3Upload, { S3UploadProps } from './S3Upload';

export type ProjectFilesSectionProps = Omit<S3UploadProps, 'projectId'> & {
  projectURL: string;
  project: Pick<Project, 'id' | 'currentUserCanUploadFiles' | 'currentUserCanDeleteFiles'> & {
    projectFiles: ProjectFileFieldsFragment[];
  };
};

function ProjectFilesSection(props: ProjectFilesSectionProps): JSX.Element {
  const { projectURL, project, ...s3UploadProps } = props;

  return (
    <>
      <ul className="list-unstyled">
        {props.project.projectFiles.map((file) => (
          <ProjectFile
            file={file}
            projectId={project.id}
            canDelete={project.currentUserCanDeleteFiles}
            projectURL={projectURL}
            key={file.id}
          />
        ))}
      </ul>

      {project.currentUserCanUploadFiles && <S3Upload project={project} {...s3UploadProps} />}
    </>
  );
}

export default ProjectFilesSection;
