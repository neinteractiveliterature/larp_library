import { ErrorDisplay } from '@neinteractiveliterature/litform';
import { useEffect, useRef, useState, type JSX } from 'react';
import Modal from 'react-bootstrap4-modal';

import { getApolloActionError } from '../actionHelpers';
import { Project } from '../graphqlTypes.generated';
import ProjectLinkFormFields, { ProjectLinkFormProjectLink } from './ProjectLinkFormFields';
import { useProjectContentFetcher } from './useProjectContentFetcher';

export type AddProjectLinkModalProps = {
  visible: boolean;
  close: () => void;
  project: Pick<Project, 'id'>;
  /** Where to submit the new link (see ProjectContentRoute) */
  action: string;
};

const emptyProjectLink = { title: '', url: '', icon: '' };

function AddProjectLinkModal({ project, visible, close, action }: AddProjectLinkModalProps): JSX.Element {
  const [fetcher, submit] = useProjectContentFetcher(action);
  const [projectLink, setProjectLink] = useState<ProjectLinkFormProjectLink>(emptyProjectLink);
  const loading = fetcher.state !== 'idle';

  // once the link has been added, close the modal and clear the form for the next one
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data && 'done' in fetcher.data) {
      closeRef.current();
      setProjectLink(emptyProjectLink);
    }
  }, [fetcher.state, fetcher.data]);

  const addClicked = () => {
    submit({ intent: 'createLink', projectId: project.id, projectLinkAttributes: projectLink });
  };

  return (
    <Modal visible={visible}>
      <div className="modal-header">Add link</div>
      <div className="modal-body">
        <ProjectLinkFormFields projectLink={projectLink} onChange={setProjectLink} />
        <ErrorDisplay graphQLError={getApolloActionError(fetcher.data)} />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={close} disabled={loading}>
          Cancel
        </button>
        <button type="button" className="btn btn-primary" onClick={addClicked} disabled={loading}>
          Add
        </button>
      </div>
    </Modal>
  );
}

export default AddProjectLinkModal;
