import ErrorDisplay from '../Litform/ErrorDisplay';
import LoadingIndicator from '../Litform/LoadingIndicator';
import ProjectFile from './ProjectFile';
import { useProjectFilesQuery } from './queries.generated';
import S3Upload, { S3UploadFile, S3UploadProps } from './S3Upload';

export type ProjectFilesSectionProps = S3UploadProps & {
  initialFiles: S3UploadFile[];
  canUpload: boolean;
  canDelete: boolean;
  projectURL: string;
  projectId: string;
};

function ProjectFilesSection(props: ProjectFilesSectionProps): JSX.Element {
  const { data, loading, error } = useProjectFilesQuery({
    variables: { projectId: props.projectId },
  });

  const { canDelete, canUpload, projectURL, ...s3UploadProps } = props;

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorDisplay graphQLError={error} />;
  }

  const projectFiles = data?.project.projectFiles ?? [];

  return (
    <>
      <ul className="list-unstyled">
        {projectFiles.map((file) => (
          <ProjectFile
            file={file}
            projectId={props.projectId}
            canDelete={canDelete}
            projectURL={projectURL}
            key={file.id}
          />
        ))}
      </ul>

      {canUpload && <S3Upload {...s3UploadProps} />}
    </>
  );
}

export default ProjectFilesSection;
