import React, { useCallback, useMemo } from 'react';
import {
  buildOptimisticArrayForMove,
  useGraphQLConfirm,
  useSortable,
} from '@neinteractiveliterature/litform';
import { useDeleteProjectFileMutation, useMoveProjectFileMutation } from './mutations.generated';
import { ProjectPageQueryData } from './queries.generated';
import { Project } from '../graphqlTypes.generated';
import { deleteObjectFromReferenceArrayUpdater } from '../MutationModifierHelpers';
import ProjectFileDisplay from './ProjectFileDisplay';
import S3Upload, { S3UploadProps } from './S3Upload';

export type EditProjectFileProps = {
  file: ProjectPageQueryData['project']['projectFiles'][number];
  project: Pick<Project, 'id' | 'currentUserCanDeleteFiles'>;
  index: number;
  moveProjectFile: (dragIndex: number, hoverIndex: number) => void;
};

export function EditProjectFile({
  file,
  project,
  index,
  moveProjectFile,
}: EditProjectFileProps): JSX.Element {
  const [deleteProjectFile] = useDeleteProjectFileMutation();
  const confirm = useGraphQLConfirm();
  const [ref, drag, { isDragging }] = useSortable<HTMLLIElement>(
    index,
    moveProjectFile,
    'projectFile',
  );

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
    <li className="d-flex" ref={ref}>
      <div className="me-2">
        <span className="visually-hidden">Drag to reorder</span>
        <i style={{ cursor: isDragging ? 'grabbing' : 'grab' }} className="fa fa-bars" ref={drag} />
      </div>
      <ProjectFileDisplay file={file} />
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

export type EditProjectFilesCardProps = Omit<S3UploadProps, 'projectId'> & {
  project: ProjectPageQueryData['project'];
};

function EditProjectFilesCard({
  project,
  ...s3UploadProps
}: EditProjectFilesCardProps): JSX.Element {
  const [moveProjectFile] = useMoveProjectFileMutation();
  const sortedFiles = useMemo(
    () => [...project.projectFiles].sort((a, b) => a.position - b.position),
    [project.projectFiles],
  );
  const moveFile = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const optimisticFiles = buildOptimisticArrayForMove(sortedFiles, dragIndex, hoverIndex);

      moveProjectFile({
        variables: {
          id: sortedFiles[dragIndex].id,
          destinationIndex: hoverIndex,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          moveProjectFile: {
            __typename: 'MoveProjectFilePayload',
            project: {
              ...project,
              projectFiles: optimisticFiles,
            },
          },
        },
      });
    },
    [project, moveProjectFile, sortedFiles],
  );

  return (
    <div className="card col-md-4 me-md-2 mb-2 mb-md-0">
      <div className="card-header">Files</div>
      <div className="card-body">
        <ul className="list-unstyled">
          {sortedFiles.map((file, index) => (
            <EditProjectFile
              file={file}
              project={project}
              index={index}
              key={file.id}
              moveProjectFile={moveFile}
            />
          ))}
        </ul>

        {project.license != null && project.currentUserCanUploadFiles ? (
          <S3Upload project={project} {...s3UploadProps} />
        ) : (
          <div>
            Attaching files is disabled for this project because it does not specify a license.
          </div>
        )}
      </div>
    </div>
  );
}

export default EditProjectFilesCard;
