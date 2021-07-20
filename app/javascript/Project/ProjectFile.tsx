import { Reference } from '@apollo/client';
import React from 'react';
import { useGraphQLConfirm } from '@neinteractiveliterature/litform';
import { useDeleteProjectFileMutation } from './mutations.generated';
import { ProjectPageQuery } from './queries';
import { ProjectPageQueryData } from './queries.generated';
import { Project } from '../graphqlTypes.generated';
import { deleteObjectFromReferenceArrayUpdater } from '../MutationModifierHelpers';

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
  file: ProjectPageQueryData['project']['projectFiles'][number];
  project: Pick<Project, 'id' | 'currentUserCanDeleteFiles'>;
};

function ProjectFile({ file, project }: ProjectFileProps): JSX.Element {
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
          update: deleteObjectFromReferenceArrayUpdater(project, 'projectFiles', file),
        }),
    });
  };

  return (
    <li className="d-flex">
      <div className="flex-grow-1">
        <a href={file.url}>
          <i className={`fa ${getIconForMimeType(file.filetype)}`} /> {file.filename}
        </a>{' '}
        <small>{numberToHumanSize(file.filesize)}</small>
      </div>
      {project.currentUserCanDeleteFiles && (
        <div>
          <button type="button" className="btn btn-outline-danger btn-sm" onClick={deleteClicked}>
            <i className="fa fa-trash-o" />
            <span className="visually-hidden">Delete file {file.filename}</span>
          </button>
        </div>
      )}
    </li>
  );
}

export default ProjectFile;
