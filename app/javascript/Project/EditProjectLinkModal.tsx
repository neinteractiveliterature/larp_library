import { ErrorDisplay } from '@neinteractiveliterature/litform';
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap4-modal';

import { ProjectLink } from '../graphqlTypes.generated';
import { useUpdateProjectLinkMutation } from './mutations.generated';
import ProjectLinkFormFields, { ProjectLinkFormProjectLink } from './ProjectLinkFormFields';

export type EditProjectLinkModalProps = {
  visible: boolean;
  close: () => void;
  initialProjectLink?: ProjectLinkFormProjectLink & Pick<ProjectLink, 'id'>;
};

function EditProjectLinkModal({
  initialProjectLink,
  visible,
  close,
}: EditProjectLinkModalProps): JSX.Element {
  const [updateProjectLink, { loading, error }] = useUpdateProjectLinkMutation();
  const [projectLink, setProjectLink] = useState<ProjectLinkFormProjectLink>(
    initialProjectLink ?? { title: '', url: '' },
  );

  useEffect(() => {
    if (initialProjectLink) {
      setProjectLink(initialProjectLink);
    }
  }, [initialProjectLink]);

  const addClicked = async () => {
    if (!initialProjectLink) {
      return;
    }

    await updateProjectLink({
      variables: {
        projectLinkAttributes: {
          icon: projectLink.icon,
          title: projectLink.title,
          url: projectLink.url,
        },
        id: initialProjectLink.id,
      },
    });
    close();
  };

  return (
    <Modal visible={visible}>
      <div className="modal-header">Edit link</div>
      <div className="modal-body">
        <ProjectLinkFormFields projectLink={projectLink} onChange={setProjectLink} />
        <ErrorDisplay graphQLError={error} />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={close} disabled={loading}>
          Cancel
        </button>
        <button type="button" className="btn btn-primary" onClick={addClicked} disabled={loading}>
          Save
        </button>
      </div>
    </Modal>
  );
}

export default EditProjectLinkModal;
