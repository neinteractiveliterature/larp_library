import { useQuery } from '@apollo/client';
import { LoadQueryWrapper } from '@neinteractiveliterature/litform-apollo';
import { Link, useParams } from 'react-router';
import { generateProjectPath } from '../URLGenerators';
import ProjectContentFields from './ProjectContentFields';
import { ProjectPageQueryDocument } from './queries.generated';

function useLoadProject() {
  const { projectId } = useParams();
  if (projectId == null) {
    throw new Error('projectId param is required');
  }
  return useQuery(ProjectPageQueryDocument, { variables: { projectId } });
}

export default LoadQueryWrapper(useLoadProject, function ProjectInitialContentPage({ data }) {
  return (
    <>
      <h1>Content</h1>
      <ProjectContentFields project={data.project} />
      <div className="mt-4">
        <Link to={generateProjectPath(data.project)} className="btn btn-primary">
          Finish and go to project page
        </Link>
      </div>
    </>
  );
});
