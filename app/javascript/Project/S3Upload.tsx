import React, { useContext, useMemo, useState } from 'react';
import { useCompleteProjectFileUploadMutation } from './mutations.generated';
import { S3ConfigurationContext } from '../S3ConfigurationContext';
import { ProjectFileFieldsFragment } from './queries';
import { Project } from '../graphqlTypes.generated';
import { addNewObjectToReferenceArrayUpdater, LoadingIndicator } from '@neinteractiveliterature/litform';
import { ObjectCannedACL, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { createRequestSigner } from './uploadSigning';
import { useApolloClient } from '@apollo/client';
import { getApplyMd5BodyChecksumPlugin, resolveMd5BodyChecksumConfig } from '@aws-sdk/middleware-apply-body-checksum';
import { AbortController } from '@aws-sdk/abort-controller';

export type S3UploadFile = {
  id: number;
  url: string;
  filename: string;
  filesize: number;
  filetype: string;
};

export type S3UploadProps = {
  project: Pick<Project, 'id'>;
};

function S3Upload({ project }: S3UploadProps): JSX.Element {
  const { awsRegion, bucketName } = useContext(S3ConfigurationContext);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string>();
  const [progressPercent, setProgressPercent] = useState(0);
  const [error, setError] = useState<string>();
  const [completeProjectFileUpload] = useCompleteProjectFileUploadMutation();
  const apolloClient = useApolloClient();
  const requestSigner = useMemo(() => createRequestSigner(apolloClient), [apolloClient]);

  const s3Client = useMemo(() => {
    const client = new S3Client({
      signer: requestSigner,
      region: awsRegion,
    });
    client.middlewareStack.use(getApplyMd5BodyChecksumPlugin(resolveMd5BodyChecksumConfig(client.config)));
    client.config.logger = console;
    return client;
  }, [requestSigner, awsRegion]);

  const uploadNextFile = async (fileQueue: File[]) => {
    if (!fileQueue || fileQueue.length === 0) {
      setUploading(false);
      setMessage(undefined);
      return;
    }

    const file = fileQueue[0];
    const contents = await file.arrayBuffer();
    setMessage(`Uploading ${file.name}...`);

    const abortController = new AbortController();
    const uniqueId = Math.random().toString(36).slice(2, 18);
    const objectName = `uploads/${new Date().getTime()}-${uniqueId}/${file.name.replace(/[^A-Za-z0-9.]/g, '_')}`;

    const upload = new Upload({
      client: s3Client,
      abortController,
      params: {
        Bucket: bucketName,
        Key: objectName,
        ACL: ObjectCannedACL.public_read,
        Body: new Uint8Array(contents),
        ContentDisposition: `attachment; filename="${file.name.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`,
        ContentType: file.type,
        StorageClass: 'STANDARD',
      },
    });
    upload.on('httpUploadProgress', (progress) => {
      setProgressPercent(Math.round(((progress.loaded ?? 0) / (progress.total ?? 1)) * 100));
    });

    try {
      await upload.done();

      await completeProjectFileUpload({
        variables: {
          projectId: project.id,
          url: `https://${bucketName}.s3.amazonaws.com/${objectName}`,
          filename: file.name,
          filetype: file.type,
          filesize: file.size,
          filepath: objectName,
        },
        update: addNewObjectToReferenceArrayUpdater(
          project,
          'projectFiles',
          (data) => data.completeProjectFileUpload?.projectFile,
          ProjectFileFieldsFragment,
        ),
      });

      uploadNextFile(fileQueue.slice(1));
    } catch (error) {
      console.error(error);
      setError(error.toString());
      setUploading(false);
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
        <label className="form-label" htmlFor="file">
          Upload files
        </label>
        <input type="file" id="file" className="form-control" multiple onChange={fileChanged} disabled={uploading} />

        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          {error && <div className="text-danger">{error}</div>}
          {message}
          {uploading && <LoadingIndicator size={9} />}
          {(uploading || error) && (
            <div className="progress">
              {' '}
              <div
                className={
                  error
                    ? 'progress-bar progress-bar-danger'
                    : 'progress-bar progress-bar-striped progress-bar-animated active'
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
          )}
        </div>
      </div>
    </div>
  );
}

export default S3Upload;
