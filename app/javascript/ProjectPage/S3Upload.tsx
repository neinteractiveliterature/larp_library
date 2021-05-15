import React, { useState } from 'react';
import Evaporate from 'evaporate';
import { useCompleteProjectFileUploadMutation } from './mutations.generated';
import { ProjectFilesQueryData, ProjectFilesQueryDocument } from './queries.generated';

export type S3UploadFile = {
  id: number;
  url: string;
  filename: string;
  filesize: number;
  filetype: string;
};

export type S3UploadProps = {
  awsAccessKeyId: string;
  signerURL: string;
  bucket: string;
  nonce: string;
  projectId: string;
};

function S3Upload({
  awsAccessKeyId,
  signerURL,
  bucket,
  nonce,
  projectId,
}: S3UploadProps): JSX.Element {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string>();
  const [progressPercent, setProgressPercent] = useState(0);
  const [error, setError] = useState<string>();
  const [completeProjectFileUpload] = useCompleteProjectFileUploadMutation();

  const uploadNextFile = async (fileQueue: File[]) => {
    if (!fileQueue || fileQueue.length === 0) {
      setUploading(false);
      setMessage(undefined);
      return;
    }

    const file = fileQueue[0];
    setMessage(`Uploading ${file.name}...`);

    const evaporate = await Evaporate.create({
      aws_key: awsAccessKeyId,
      signerUrl: signerURL,
      bucket: bucket,
      awsSignatureVersion: '2',
    });
    const uniqueId = Math.random().toString(36).substr(2, 16);
    const objectName = `uploads/${new Date().getTime()}-${uniqueId}-${nonce}/${file.name}`;

    try {
      const awsObjectKey = await evaporate.add({
        name: objectName,
        file: file,
        contentType: file.type,
        progress: (progress) => {
          setProgressPercent(progress * 100);
        },
        xAmzHeadersAtInitiate: {
          'x-amz-acl': 'public-read',
        },
      });

      await completeProjectFileUpload({
        variables: {
          projectId,
          url: `https://${bucket}.s3.amazonaws.com/${awsObjectKey}`,
          filename: file.name,
          filetype: file.type,
          filesize: file.size,
          filepath: awsObjectKey,
        },
        update: (cache, result) => {
          const data = cache.readQuery<ProjectFilesQueryData>({
            query: ProjectFilesQueryDocument,
            variables: { projectId },
          });
          const newFile = result.data?.completeProjectFileUpload?.projectFile;
          if (data && newFile) {
            cache.writeQuery<ProjectFilesQueryData>({
              query: ProjectFilesQueryDocument,
              variables: { projectId },
              data: {
                ...data,
                project: {
                  ...data.project,
                  projectFiles: [...data.project.projectFiles, newFile],
                },
              },
            });
          }
        },
      });

      uploadNextFile(fileQueue.slice(1));
    } catch (error) {
      setError(error.message);
    }
  };

  const fileChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const eventFiles = event.target.files;
    if (eventFiles == null) {
      return;
    }

    const files: File[] = [];
    for (let i = 0; i < eventFiles.length; i++) {
      files.push(eventFiles[i]);
    }

    setUploading(true);
    setProgressPercent(0);
    setError(undefined);
    uploadNextFile(files);
  };

  return (
    <div className="card bg-light">
      <div className="card-body">
        <label htmlFor="file">Upload files</label>
        <input type="file" id="file" multiple onChange={fileChanged} disabled={uploading} />

        {uploading && (
          <div style={{ marginTop: '10px', marginBottom: '10px' }}>
            {error && <div className="text-danger">{error}</div>}
            {message}
            <div className="progress">
              {' '}
              <div
                className={
                  error
                    ? 'progress-bar progress-bar-danger'
                    : 'progress-bar progress-bar-striped active'
                }
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{ width: `${progressPercent}%` }}
              >
                <span className="sr-only">{progressPercent}% Complete</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default S3Upload;
