import { ErrorDisplay, LoadQueryWrapper } from '@neinteractiveliterature/litform/lib';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { generateProjectPath } from '../URLGenerators';
import { buildProjectAttributes } from './buildProjectAttributes';
import { useUpdateProjectMutation } from './mutations.generated';
import ProjectContentFields from './ProjectContentFields';
import ProjectFormFields from './ProjectFormFields';
import { useProjectPageQuery } from './queries.generated';

function useLoadProject() {
  const { projectId } = useParams();
  return useProjectPageQuery({ variables: { projectId } });
}

export default LoadQueryWrapper(useLoadProject, function EditProjectPage({ data }) {
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
      <h1>Editing project “{data.project.title}”</h1>
      <Link to={generateProjectPath(project)}>
        <i className="fa fa-arrow-left" /> Back to project page
      </Link>

      <section className="mt-4">
        <h2>Project properties</h2>
        <ProjectFormFields licenseOptions={data.licenses} onChange={setProject} project={project} />
        <button className="btn btn-primary" type="button" onClick={saveProject}>
          Save changes
        </button>
        <ErrorDisplay graphQLError={error} />
      </section>

      <hr />

      <section>
        <h2>Project content</h2>

        <ProjectContentFields
          project={data.project}
          signerURL={`${generateProjectPath(project)}/project_files/auth_upload`}
        />
      </section>
    </>
  );
});
