import { Tabs, useTabsWithRouter } from '@neinteractiveliterature/litform/dist';
import { ErrorDisplay, LoadQueryWrapper } from '@neinteractiveliterature/litform/lib';
import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
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
  const [updateProject, { loading, error }] = useUpdateProjectMutation();
  const location = useLocation();
  const navigate = useNavigate();
  const history = useMemo(() => ({ replace: navigate }), [navigate]);
  const [saved, setSaved] = useState(false);

  const saveProject = async () => {
    await updateProject({
      variables: {
        id: project.id,
        projectAttributes: buildProjectAttributes(project),
      },
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 5000);
  };

  const { selectedTab, setSelectedTab, tabs } = useTabsWithRouter(
    [
      {
        id: 'properties',
        name: 'Project properties',
        renderContent: function ProjectPropertiesTab() {
          return (
            <section className="p-2 bg-light border border-color-light border-top-0">
              <ProjectFormFields
                licenseOptions={data.licenses}
                onChange={setProject}
                project={project}
              />
              <button
                className="btn btn-primary"
                type="button"
                onClick={saveProject}
                disabled={loading}
              >
                {saved ? (
                  <>
                    Saved! <i className="bi-check" />
                  </>
                ) : (
                  'Save changes'
                )}
              </button>
              <ErrorDisplay graphQLError={error} />
            </section>
          );
        },
      },
      {
        id: 'content',
        name: 'Project content',
        renderContent: function ProjectContentTab() {
          return (
            <section className="p-2 bg-light border border-color-light border-top-0">
              <ProjectContentFields
                project={data.project}
                signerURL={`${generateProjectPath(project)}/project_files/auth_upload`}
              />
            </section>
          );
        },
      },
    ],
    `${generateProjectPath(data.project)}/edit`,
    location,
    history,
    'properties',
  );

  return (
    <>
      <h1>Editing project “{data.project.title}”</h1>
      <div className="my-3">
        <Link to={generateProjectPath(project)}>
          <i className="bi-arrow-left" /> Back to project page
        </Link>
      </div>

      <Tabs
        setSelectedTab={setSelectedTab}
        tabs={tabs}
        selectedTab={selectedTab}
        selectedTabClassName="bg-light border-bottom-light"
      />
    </>
  );
});
