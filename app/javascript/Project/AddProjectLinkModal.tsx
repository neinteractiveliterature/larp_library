import { useMutation } from '@apollo/client';
import { ErrorDisplay } from '@neinteractiveliterature/litform';
import { addNewObjectToReferenceArrayUpdater } from '@neinteractiveliterature/litform-apollo';
import { useState, type JSX } from 'react';
import Modal from 'react-bootstrap4-modal';

import { Project, ProjectLink } from '../graphqlTypes.generated';
import { CreateProjectLinkDocument } from './mutations.generated';
import ProjectLinkFormFields, { ProjectLinkFormProjectLink } from './ProjectLinkFormFields';
import { ProjectLinkFieldsFragment as ProjectLinkFieldsFragmentDoc } from './queries';

export type AddProjectLinkModalProps = {
  visible: boolean;
  close: () => void;
  project: Pick<Project, 'id'> & {
    projectLinks: Pick<ProjectLink, 'id'>[];
  };
};

function AddProjectLinkModal({ project, visible, close }: AddProjectLinkModalProps): JSX.Element {
  const [createProjectLink, { loading, error }] = useMutation(CreateProjectLinkDocument);
  const [projectLink, setProjectLink] = useState<ProjectLinkFormProjectLink>({
    title: '',
    url: '',
    icon: '',
  });

  const addClicked = async () => {
    await createProjectLink({
      variables: {
        projectLinkAttributes: projectLink,
        projectId: project.id,
      },
      update: addNewObjectToReferenceArrayUpdater(
        project,
        'projectLinks',
        (data) => data.createProjectLink?.projectLink,
        ProjectLinkFieldsFragmentDoc,
      ),
    });
    close();
    setProjectLink({
      title: '',
      url: '',
      icon: '',
    });
  };

  return (
    <Modal visible={visible}>
      <div className="modal-header">Add link</div>
      <div className="modal-body">
        <ProjectLinkFormFields projectLink={projectLink} onChange={setProjectLink} />
        <ErrorDisplay graphQLError={error} />
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
