import React, { useContext, useState } from 'react';
import Evaporate from 'evaporate';
import { useCompleteProjectFileUploadMutation } from './mutations.generated';
import { S3ConfigurationContext } from '../S3ConfigurationContext';
import { ApolloCache, DocumentNode, Reference } from '@apollo/client';
import { ProjectFileFieldsFragment } from './queries';
import { Project } from '../graphqlTypes.generated';
import { Modifier } from '@apollo/client/cache/core/types/common';

export type S3UploadFile = {
  id: number;
  url: string;
  filename: string;
  filesize: number;
  filetype: string;
};

export type S3UploadProps = {
  signerURL: string;
  project: Pick<Project, 'id'>;
};

function addNewObjectToReferenceArrayModifier<Q, T extends { id: string }>(
  cache: ApolloCache<Q>,
  newObject: T,
  fragment: DocumentNode,
) {
  const modifier: Modifier<(Reference | undefined)[]> = (
    existingProjectFileRefs,
    { readField },
  ) => {
    const newProjectFileRef = cache.writeFragment({
      data: newObject,
      fragment: fragment,
    });

    if (existingProjectFileRefs.some((ref: Reference) => readField('id', ref) === newObject.id)) {
      return existingProjectFileRefs;
    }

    return [...existingProjectFileRefs, newProjectFileRef];
  };

  return modifier;
}

function S3Upload({ signerURL, project }: S3UploadProps): JSX.Element {
  const { awsAccessKeyId, bucketName } = useContext(S3ConfigurationContext);
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
      bucket: bucketName,
      awsSignatureVersion: '2',
    });
    const uniqueId = Math.random().toString(36).substr(2, 16);
    const objectName = `uploads/${new Date().getTime()}-${uniqueId}/${file.name}`;

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
          projectId: project.id,
          url: `https://${bucketName}.s3.amazonaws.com/${awsObjectKey}`,
          filename: file.name,
          filetype: file.type,
          filesize: file.size,
          filepath: awsObjectKey,
        },
        update: (cache, result) => {
          const newProjectFile = result.data?.completeProjectFileUpload?.projectFile;
          if (newProjectFile) {
            cache.modify({
              id: cache.identify(project),
              fields: {
                projectFiles: addNewObjectToReferenceArrayModifier(
                  cache,
                  newProjectFile,
                  ProjectFileFieldsFragment,
                ),
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
