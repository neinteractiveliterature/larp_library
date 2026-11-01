import {
  ErrorDisplay,
  useConfirm,
  useModal,
  useArrayBasicSortableHandlers,
  useMatchWidthStyle,
  ModalData,
} from '@neinteractiveliterature/litform';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useMemo, useCallback, type JSX } from 'react';
import { ProjectLink } from '../graphqlTypes.generated';
import { getApolloActionError } from '../actionHelpers';
import { getSortableStyle, useSortableDndSensors } from '../SortableUtils';
import { generateProjectContentActionPath } from '../URLGenerators';
import AddProjectLinkModal from './AddProjectLinkModal';
import EditProjectLinkModal, { EditProjectLinkModalProps } from './EditProjectLinkModal';
import { ProjectLinkDisplayProps, ProjectLinkDisplay } from './ProjectLinkDisplay';
import { ProjectFieldsFragment } from './queries.generated';
import { useOptimisticMove } from './useOptimisticMove';
import { useProjectContentFetcher } from './useProjectContentFetcher';

type EditProjectLinkProps = {
  link: ProjectLinkDisplayProps['link'] & Pick<ProjectLink, 'id'>;
  editProjectLinkModal: ModalData<Pick<EditProjectLinkModalProps, 'initialProjectLink'>>;
  /** Where to submit changes to the link (see ProjectContentRoute) */
  action: string;
};

function EditProjectLink({ link, editProjectLinkModal, action }: EditProjectLinkProps) {
  const confirm = useConfirm();
  const [deleteFetcher, submitDelete] = useProjectContentFetcher(action);

  const { attributes, listeners, isDragging, setNodeRef, transform, transition } = useSortable({
    id: link.id,
  });
  const style = getSortableStyle(transform, transition, isDragging);

  return (
    <li key={link.id} className="d-flex" style={style}>
      <div className="me-2">
        <span className="visually-hidden">Drag to reorder</span>
        <i style={{ cursor: 'grab' }} className="bi-grip-vertical" ref={setNodeRef} {...attributes} {...listeners} />
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
              action: async () => {
                await submitDelete({ intent: 'deleteLink', id: link.id });
              },
            })
          }
          aria-label="Delete link"
          disabled={deleteFetcher.state !== 'idle'}
        >
          <i className="bi-trash" />
        </button>
        <ErrorDisplay graphQLError={getApolloActionError(deleteFetcher.data)} />
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
  const action = generateProjectContentActionPath(project);
  const [moveFetcher, submitMove] = useProjectContentFetcher(action);

  const linksByPosition = useMemo(
    () => [...project.projectLinks].sort((a, b) => a.position - b.position),
    [project.projectLinks],
  );
  // while a move is being saved, show the links where they're going to end up
  const sortedLinks = useOptimisticMove(linksByPosition, moveFetcher, 'moveLink');

  const moveLink = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      submitMove({ intent: 'moveLink', id: sortedLinks[dragIndex].id, destinationIndex: hoverIndex });
    },
    [submitMove, sortedLinks],
  );

  const sensors = useSortableDndSensors();
  const { draggingItem, ...sortableHandlers } = useArrayBasicSortableHandlers(sortedLinks, moveLink, 'id');
  const [matchWidthRef, matchWidthStyle] = useMatchWidthStyle<HTMLDivElement>();

  return (
    <DndContext sensors={sensors} {...sortableHandlers}>
      <div className="card col-md-4 me-md-2 mb-2 mb-md-0" ref={matchWidthRef}>
        <div className="card-header">Links</div>
        <div className="card-body">
          <ul className="list-unstyled">
            <SortableContext items={sortedLinks.map((link) => link.id)} strategy={verticalListSortingStrategy}>
              {sortedLinks.map((link) => (
                <EditProjectLink
                  link={link}
                  editProjectLinkModal={editProjectLinkModal}
                  action={action}
                  key={link.id}
                />
              ))}
            </SortableContext>
          </ul>

          <button type="button" className="btn btn-outline-success" onClick={() => addProjectLinkModal.open()}>
            Add link
          </button>
          <ErrorDisplay graphQLError={getApolloActionError(moveFetcher.data)} />
        </div>
      </div>
      <AddProjectLinkModal
        visible={addProjectLinkModal.visible}
        close={addProjectLinkModal.close}
        project={project}
        action={action}
      />
      <EditProjectLinkModal
        visible={editProjectLinkModal.visible}
        close={editProjectLinkModal.close}
        initialProjectLink={editProjectLinkModal.state?.initialProjectLink}
        action={action}
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
