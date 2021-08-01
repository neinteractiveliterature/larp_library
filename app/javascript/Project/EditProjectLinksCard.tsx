import {
  useConfirm,
  useSortable,
  DndWrapper,
  useModal,
  buildOptimisticArrayForMove,
} from '@neinteractiveliterature/litform';
import { ModalData } from '@neinteractiveliterature/litform/dist/useModal';
import { useMemo, useCallback } from 'react';
import { Project, ProjectLink } from '../graphqlTypes.generated';
import { deleteObjectFromReferenceArrayUpdater } from '../MutationModifierHelpers';
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
  index: number;
  moveProjectLink: (dragIndex: number, hoverIndex: number) => void;
  editProjectLinkModal: ModalData<Pick<EditProjectLinkModalProps, 'initialProjectLink'>>;
};

function EditProjectLink({
  project,
  link,
  index,
  moveProjectLink,
  editProjectLinkModal,
}: EditProjectLinkProps) {
  const confirm = useConfirm();
  const [deleteProjectLink] = useDeleteProjectLinkMutation();

  const [ref, drag, { isDragging }] = useSortable<HTMLLIElement>(
    index,
    moveProjectLink,
    'projectLink',
  );

  return (
    <li key={link.id} className="d-flex" ref={ref}>
      <div className="me-2">
        <span className="visually-hidden">Drag to reorder</span>
        <i style={{ cursor: isDragging ? 'grabbing' : 'grab' }} className="fa fa-bars" ref={drag} />
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
          <i className="fa fa-pencil" /> Edit
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
          <i className="fa fa-trash-o" />
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

  return (
    <>
      <div className="card col-md-4 me-md-2 mb-2 mb-md-0">
        <div className="card-header">Links</div>
        <div className="card-body">
          <ul className="list-unstyled">
            {sortedLinks.map((link, index) => (
              <EditProjectLink
                link={link}
                project={project}
                editProjectLinkModal={editProjectLinkModal}
                index={index}
                moveProjectLink={moveLink}
                key={link.id}
              />
            ))}
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
    </>
  );
}

export default EditProjectLinksCard;
