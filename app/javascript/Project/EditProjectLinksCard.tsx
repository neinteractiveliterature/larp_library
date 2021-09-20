import {
  useConfirm,
  useModal,
  buildOptimisticArrayForMove,
  deleteObjectFromReferenceArrayUpdater,
  useArrayBasicSortableHandlers,
  useMatchWidthStyle,
} from '@neinteractiveliterature/litform';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ModalData } from '@neinteractiveliterature/litform/dist/useModal';
import { useMemo, useCallback } from 'react';
import { Project, ProjectLink } from '../graphqlTypes.generated';
import { getSortableStyle, useSortableDndSensors } from '../SortableUtils';
import AddProjectLinkModal from './AddProjectLinkModal';
import EditProjectLinkModal, { EditProjectLinkModalProps } from './EditProjectLinkModal';
import { useDeleteProjectLinkMutation, useMoveProjectLinkMutation } from './mutations.generated';
import { ProjectLinkDisplayProps, ProjectLinkDisplay } from './ProjectLinkDisplay';
import { ProjectFieldsFragment } from './queries.generated';

type EditProjectLinkProps = {
  project: Pick<Project, 'id'> & {
    projectLinks: Pick<ProjectLink, 'id'>[];
  };
  link: ProjectLinkDisplayProps['link'] & Pick<ProjectLink, 'id'>;
  editProjectLinkModal: ModalData<Pick<EditProjectLinkModalProps, 'initialProjectLink'>>;
};

function EditProjectLink({ project, link, editProjectLinkModal }: EditProjectLinkProps) {
  const confirm = useConfirm();
  const [deleteProjectLink] = useDeleteProjectLinkMutation();

  const { attributes, listeners, isDragging, setNodeRef, transform, transition } = useSortable({
    id: link.id,
  });
  const style = getSortableStyle(transform, transition, isDragging);

  return (
    <li key={link.id} className="d-flex" style={style}>
      <div className="me-2">
        <span className="visually-hidden">Drag to reorder</span>
        <i
          style={{ cursor: 'grab' }}
          className="bi-grip-vertical"
          ref={setNodeRef}
          {...attributes}
          {...listeners}
        />
      </div>
      <div className="flex-grow-1">
        <ProjectLinkDisplay link={link} />
      </div>
      <div>
        <button
          className="btn btn-outline-primary btn-sm"
          type="button"
          onClick={() => editProjectLinkModal.open({ initialProjectLink: link })}
        >
          <i className="bi-pencil-fill" /> Edit
        </button>{' '}
        <button
          className="btn btn-outline-danger btn-sm"
          type="button"
          onClick={() =>
            confirm({
              prompt: `Are you sure you want to delete the “${link.title}” link?`,
              action: () =>
                deleteProjectLink({
                  variables: { id: link.id },
                  update: deleteObjectFromReferenceArrayUpdater(project, 'projectLinks', link),
                }),
            })
          }
          aria-label="Delete link"
        >
          <i className="bi-trash" />
        </button>
      </div>
    </li>
  );
}

function EditProjectLinkDragPreview({ link }: Pick<EditProjectLinkProps, 'link'>) {
  return (
    <li key={link.id} className="d-flex">
      <div className="me-2">
        <span className="visually-hidden">Drag to reorder</span>
        <i style={{ cursor: 'grabbing' }} className="bi-grip-vertical" />
      </div>
      <div className="flex-grow-1">
        <ProjectLinkDisplay link={link} />
      </div>
      <div>
        <button className="btn btn-outline-primary btn-sm" type="button">
          <i className="bi-pencil-fill" /> Edit
        </button>{' '}
        <button className="btn btn-outline-danger btn-sm" type="button" aria-label="Delete link">
          <i className="bi-trash" />
        </button>
      </div>
    </li>
  );
}

export type EditProjectLinksCardProps = {
  project: ProjectFieldsFragment;
};

function EditProjectLinksCard({ project }: EditProjectLinksCardProps): JSX.Element {
  const addProjectLinkModal = useModal();
  const editProjectLinkModal = useModal<Pick<EditProjectLinkModalProps, 'initialProjectLink'>>();
  const [moveProjectLink] = useMoveProjectLinkMutation();

  const sortedLinks = useMemo(
    () => [...project.projectLinks].sort((a, b) => a.position - b.position),
    [project.projectLinks],
  );

  const moveLink = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const optimisticLinks = buildOptimisticArrayForMove(sortedLinks, dragIndex, hoverIndex);

      moveProjectLink({
        variables: {
          id: sortedLinks[dragIndex].id,
          destinationIndex: hoverIndex,
        },
        optimisticResponse: {
          __typename: 'Mutation',
          moveProjectLink: {
            __typename: 'MoveProjectLinkPayload',
            project: {
              ...project,
              projectLinks: optimisticLinks,
            },
          },
        },
      });
    },
    [project, moveProjectLink, sortedLinks],
  );

  const sensors = useSortableDndSensors();
  const { draggingItem, ...sortableHandlers } = useArrayBasicSortableHandlers(
    sortedLinks,
    moveLink,
    'id',
  );
  const [matchWidthRef, matchWidthStyle] = useMatchWidthStyle<HTMLDivElement>();

  return (
    <DndContext sensors={sensors} {...sortableHandlers}>
      <div className="card col-md-4 me-md-2 mb-2 mb-md-0" ref={matchWidthRef}>
        <div className="card-header">Links</div>
        <div className="card-body">
          <ul className="list-unstyled">
            <SortableContext
              items={sortedLinks.map((link) => link.id)}
              strategy={verticalListSortingStrategy}
            >
              {sortedLinks.map((link) => (
                <EditProjectLink
                  link={link}
                  project={project}
                  editProjectLinkModal={editProjectLinkModal}
                  key={link.id}
                />
              ))}
            </SortableContext>
          </ul>

          <button
            type="button"
            className="btn btn-outline-success"
            onClick={() => addProjectLinkModal.open()}
          >
            Add link
          </button>
        </div>
      </div>
      <AddProjectLinkModal
        visible={addProjectLinkModal.visible}
        close={addProjectLinkModal.close}
        project={project}
      />
      <EditProjectLinkModal
        visible={editProjectLinkModal.visible}
        close={editProjectLinkModal.close}
        initialProjectLink={editProjectLinkModal.state?.initialProjectLink}
      />
      {draggingItem && (
        <DragOverlay>
          <div style={matchWidthStyle}>
            <EditProjectLinkDragPreview link={draggingItem} />
          </div>
        </DragOverlay>
      )}
    </DndContext>
  );
}

export default EditProjectLinksCard;
