import { ErrorDisplay, LoadQueryWrapper } from '@neinteractiveliterature/litform/lib';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { generateProjectPath } from '../URLGenerators';
import { buildProjectAttributes } from './buildProjectAttributes';
import { useCreateProjectMutation } from './mutations.generated';
import ProjectFormFields, { ProjectFormProps } from './ProjectFormFields';
import { useNewProjectFormQuery } from './queries.generated';

function useLoadProject() {
  const { brandSlug } = useParams();
  if (brandSlug == null) {
    throw new Error('brandSlug param is required');
  }
  return useNewProjectFormQuery({ variables: { slug: brandSlug } });
}

export default LoadQueryWrapper(useLoadProject, function NewProjectPage({ data }) {
  const [project, setProject] = useState<ProjectFormProps['project']>({
    tags: [],
  });
  const [createProject, { error }] = useCreateProjectMutation();
  const navigate = useNavigate();

  const saveProject = async () => {
    const result = await createProject({
      variables: {
        brandId: data.brand.id,
        projectAttributes: buildProjectAttributes(project),
      },
    });
    const newProject = result.data?.createProject?.project;
    if (newProject) {
      navigate(`${generateProjectPath(newProject)}/initial_content`);
    }
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
