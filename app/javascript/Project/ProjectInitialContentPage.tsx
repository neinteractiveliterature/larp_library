import { LoadQueryWrapper } from '@neinteractiveliterature/litform';
import { Link, useParams } from 'react-router-dom';
import { generateProjectPath } from '../URLGenerators';
import ProjectContentFields from './ProjectContentFields';
import { useProjectPageQuery } from './queries.generated';

function useLoadProject() {
  const { projectId } = useParams();
  return useProjectPageQuery({ variables: { projectId } });
}

export default LoadQueryWrapper(useLoadProject, function ProjectInitialContentPage({ data }) {
  return (
    <>
      <h1>Content</h1>
      <ProjectContentFields
        project={data.project}
        signerURL={`${generateProjectPath(data.project)}/project_files/auth_upload`}
      />
      <div className="mt-4">
        <Link to={generateProjectPath(data.project)} className="btn btn-primary">
          Finish and go to project page
        </Link>
      </div>
    </>
  );
});
