import { ErrorDisplay } from '@neinteractiveliterature/litform';
import { useEffect, useRef, useState, type JSX } from 'react';
import Modal from 'react-bootstrap4-modal';

import { getApolloActionError } from '../actionHelpers';
import { ProjectLink } from '../graphqlTypes.generated';
import ProjectLinkFormFields, { ProjectLinkFormProjectLink } from './ProjectLinkFormFields';
import { useProjectContentFetcher } from './useProjectContentFetcher';

export type EditProjectLinkModalProps = {
  visible: boolean;
  close: () => void;
  initialProjectLink?: ProjectLinkFormProjectLink & Pick<ProjectLink, 'id'>;
  /** Where to submit the changes (see ProjectContentRoute) */
  action: string;
};

function EditProjectLinkModal({ initialProjectLink, visible, close, action }: EditProjectLinkModalProps): JSX.Element {
  const [fetcher, submit] = useProjectContentFetcher(action);
  const [projectLink, setProjectLink] = useState<ProjectLinkFormProjectLink>(
    initialProjectLink ?? { title: '', url: '' },
  );
  const loading = fetcher.state !== 'idle';

  useEffect(() => {
    if (initialProjectLink) {
      setProjectLink(initialProjectLink);
    }
  }, [initialProjectLink]);

  // once the changes have gone through, close the modal
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data && 'done' in fetcher.data) {
      closeRef.current();
    }
  }, [fetcher.state, fetcher.data]);

  const saveClicked = () => {
    if (!initialProjectLink) {
      return;
    }

    submit({
      intent: 'updateLink',
      id: initialProjectLink.id,
      projectLinkAttributes: { icon: projectLink.icon, title: projectLink.title, url: projectLink.url },
    });
  };

  return (
    <Modal visible={visible}>
      <div className="modal-header">Edit link</div>
      <div className="modal-body">
        <ProjectLinkFormFields projectLink={projectLink} onChange={setProjectLink} />
        <ErrorDisplay graphQLError={getApolloActionError(fetcher.data)} />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={close} disabled={loading}>
          Cancel
        </button>
        <button type="button" className="btn btn-primary" onClick={saveClicked} disabled={loading}>
          Save
        </button>
      </div>
    </Modal>
  );
}

export default EditProjectLinkModal;
