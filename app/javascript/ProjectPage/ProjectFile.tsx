import { Reference } from '@apollo/client';
import React from 'react';
import { useGraphQLConfirm } from '../Litform/Confirm';
import { useDeleteProjectFileMutation } from './mutations.generated';
import { ProjectFilesQueryData, ProjectFilesQueryDocument } from './queries.generated';

function getIconForMimeType(mimeType: string | null | undefined): string {
  if (mimeType == null) {
    return 'fa-file-o';
  }

  if (mimeType.startsWith('image/')) {
    return 'fa-file-image-o';
  }

  if (mimeType.startsWith('text/')) {
    return 'fa-file-text-o';
  }

  if (mimeType === 'application/pdf') {
    return 'fa-file-pdf-o';
  }

  if (mimeType === 'application/zip' || mimeType === 'application/gzip') {
    return 'fa-file-zip-o';
  }

  return 'fa-file-o';
}

// from https://gist.github.com/233053/f401f59c344ab2d42a341513c6caaa2bb3b2da2d
function numberToHumanSize(size: number) {
  if (size < 1024) {
    return size + ' bytes';
  } else if (size < 1024.0 * 1024.0) {
    return (size / 1024.0).toFixed(2) + ' KiB';
  } else if (size < 1024.0 * 1024.0 * 1024.0) {
    return (size / 1024.0 / 1024.0).toFixed(2) + ' MiB';
  } else {
    return (size / 1024.0 / 1024.0 / 1024.0).toFixed(2) + ' GiB';
  }
}

export type ProjectFileProps = {
  file: ProjectFilesQueryData['project']['projectFiles'][number];
  canDelete: boolean;
  projectURL: string;
  projectId: string;
};

function ProjectFile({ file, canDelete, projectURL, projectId }: ProjectFileProps): JSX.Element {
  const [deleteProjectFile] = useDeleteProjectFileMutation();
  const confirm = useGraphQLConfirm();

  const deleteClicked = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    confirm({
      prompt: `Are you sure you want to delete ${file.filename}?`,
      action: () =>
        deleteProjectFile({
          variables: { id: file.id },
          update: (cache) => {
            const data = cache.readQuery<ProjectFilesQueryData>({
              query: ProjectFilesQueryDocument,
              variables: { projectId },
            });
            if (data) {
              cache.modify({
                id: cache.identify(data.project),
                fields: {
                  projectFiles(existingProjectFileRefs, { readField }) {
                    return existingProjectFileRefs.filter(
                      (projectFileRef: Reference) => file.id !== readField('id', projectFileRef),
                    );
                  },
                },
              });
            }
          },
        }),
    });
  };

  return (
    <li>
      <a href={file.url}>
        <i className={`fa ${getIconForMimeType(file.filetype)}`} /> {file.filename}
      </a>{' '}
      <small>{numberToHumanSize(file.filesize)}</small>
      {canDelete && (
        <div className="pull-right">
          <a href={`${projectURL}/project_files/${file.id}`} onClick={deleteClicked}>
            &times;
          </a>
        </div>
      )}
    </li>
  );
}

export default ProjectFile;
