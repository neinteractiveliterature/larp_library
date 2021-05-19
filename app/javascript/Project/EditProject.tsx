import { ErrorDisplay, LoadQueryWrapper } from '@neinteractiveliterature/litform/lib';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { generateProjectPath } from '../URLGenerators';
import { buildProjectAttributes } from './buildProjectAttributes';
import { useUpdateProjectMutation } from './mutations.generated';
import ProjectFormFields from './ProjectFormFields';
import { useProjectPageQuery } from './queries.generated';

function useLoadProject() {
  const { projectId } = useParams();
  return useProjectPageQuery({ variables: { projectId } });
}

export default LoadQueryWrapper(useLoadProject, function EditProject({ data }) {
  const [project, setProject] = useState(data.project);
  const [updateProject, { error }] = useUpdateProjectMutation();
  const navigate = useNavigate();

  const saveProject = async () => {
    await updateProject({
      variables: {
        id: project.id,
        projectAttributes: buildProjectAttributes(project),
      },
    });
    navigate(generateProjectPath(project));
  };

  return (
    <>
      <ProjectFormFields licenseOptions={data.licenses} onChange={setProject} project={project} />
      <button className="btn btn-primary" type="button" onClick={saveProject}>
        Save project
      </button>
      <ErrorDisplay graphQLError={error} />
    </>
  );
});
