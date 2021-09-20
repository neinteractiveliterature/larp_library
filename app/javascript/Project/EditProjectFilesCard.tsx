import React, { useCallback, useMemo } from 'react';
import {
  buildOptimisticArrayForMove,
  deleteObjectFromReferenceArrayUpdater,
  useArrayBasicSortableHandlers,
  useGraphQLConfirm,
  useMatchWidthStyle,
} from '@neinteractiveliterature/litform';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDeleteProjectFileMutation, useMoveProjectFileMutation } from './mutations.generated';
import { ProjectPageQueryData } from './queries.generated';
import { Project } from '../graphqlTypes.generated';
import ProjectFileDisplay from './ProjectFileDisplay';
import S3Upload, { S3UploadProps } from './S3Upload';
import { getSortableStyle, useSortableDndSensors } from '../SortableUtils';

export type EditProjectFileProps = {
  file: ProjectPageQueryData['project']['projectFiles'][number];
  project: Pick<Project, 'id' | 'currentUserCanDeleteFiles'>;
};

export function EditProjectFile({ file, project }: EditProjectFileProps): JSX.Element {
  const [deleteProjectFile] = useDeleteProjectFileMutation();
  const confirm = useGraphQLConfirm();

  const { attributes, listeners, isDragging, setNodeRef, transform, transition } = useSortable({
    id: file.id,
  });
  const style = getSortableStyle(transform, transition, isDragging);

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
    <li className="d-flex" style={style}>
      <div className="me-2" ref={setNodeRef} {...attributes} {...listeners}>
        <span className="visually-hidden">Drag to reorder</span>
        <i style={{ cursor: 'grab' }} className="bi-grip-vertical" />
      </div>
      <ProjectFileDisplay file={file} />
      {project.currentUserCanDeleteFiles && (
        <div>
          <button type="button" className="btn btn-outline-danger btn-sm" onClick={deleteClicked}>
            <i className="bi-trash" />
            <span className="visually-hidden">Delete file {file.filename}</span>
          </button>
        </div>
      )}
    </li>
  );
}

function EditProjectFileDragPreview({ file, project }: EditProjectFileProps) {
  return (
    <div className="d-flex">
      <div className="me-2">
        <span className="visually-hidden">Drag to reorder</span>
        <i style={{ cursor: 'grabbing' }} className="bi-grip-vertical" />
      </div>
      <ProjectFileDisplay file={file} />
      {project.currentUserCanDeleteFiles && (
        <div>
          <button type="button" className="btn btn-outline-danger btn-sm">
            <i className="bi-trash" />
            <span className="visually-hidden">Delete file {file.filename}</span>
          </button>
        </div>
      )}
    </div>
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

  const sensors = useSortableDndSensors();
  const { draggingItem, ...sortableHandlers } = useArrayBasicSortableHandlers(
    sortedFiles,
    moveFile,
    'id',
  );
  const [matchWidthRef, matchWidthStyle] = useMatchWidthStyle<HTMLDivElement>();

  return (
    <DndContext sensors={sensors} {...sortableHandlers}>
      <div className="card col-md-4 me-md-2 mb-2 mb-md-0" ref={matchWidthRef}>
        <div className="card-header">Files</div>
        <div className="card-body">
          <ul className="list-unstyled">
            <SortableContext
              items={sortedFiles.map((file) => file.id)}
              strategy={verticalListSortingStrategy}
            >
              {sortedFiles.map((file) => (
                <EditProjectFile file={file} project={project} key={file.id} />
              ))}
            </SortableContext>
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

      {draggingItem && (
        <DragOverlay>
          <div style={matchWidthStyle}>
            <EditProjectFileDragPreview file={draggingItem} project={project} />
          </div>
        </DragOverlay>
      )}
    </DndContext>
  );
}

export default EditProjectFilesCard;
