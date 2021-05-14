import { useState } from "react";
import ProjectFile from "./ProjectFile";
import S3Upload, { S3UploadFile, S3UploadProps } from "./S3Upload";

export type ProjectFilesSectionProps = S3UploadProps & {
  initialFiles: S3UploadFile[];
  canUpload: boolean;
  canDelete: boolean;
  projectURL: string;
};

function ProjectFilesSection(props: ProjectFilesSectionProps): JSX.Element {
  const {
    initialFiles,
    canDelete,
    canUpload,
    projectURL,
    csrfToken,
    ...s3UploadProps
  } = props;
  const [files, setFiles] = useState(initialFiles);

  const fileUploaded = (file: S3UploadFile) => {
    setFiles((prevFiles) => [...prevFiles, file]);
  };

  const fileDeleted = (file: S3UploadFile) => {
    setFiles((prevFiles) =>
      prevFiles.filter((prevFile) => prevFile.id !== file.id)
    );
  };

  return (
    <>
      <ul className="list-unstyled">
        {files.map((file) => (
          <ProjectFile
            file={file}
            canDelete={canDelete}
            projectURL={projectURL}
            csrfToken={csrfToken}
            fileDeleted={fileDeleted}
            key={file.id}
          />
        ))}
      </ul>

      {canUpload && (
        <S3Upload
          {...s3UploadProps}
          csrfToken={csrfToken}
          fileUploaded={fileUploaded}
        />
      )}
    </>
  );
}

export default ProjectFilesSection;
