import { ErrorDisplay, Tabs, useTabsWithRouter } from '@neinteractiveliterature/litform';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Form, Link, useFetcher, useLocation, useNavigate } from 'react-router';
import { appContext } from '../appContext';
import { getApolloActionError, withApolloErrors } from '../actionHelpers';
import type { ProjectAttributes } from '../graphqlTypes.generated';
import { loadQuery } from '../loadQuery';
import { formatPageTitle } from '../pageTitle';
import { generateProjectPath } from '../URLGenerators';
import { buildProjectAttributes } from './buildProjectAttributes';
import { UpdateProjectDocument } from './mutations.generated';
import ProjectContentFields from './ProjectContentFields';
import ProjectFormFields from './ProjectFormFields';
import { ProjectPageQueryDocument } from './queries.generated';
import type { Route } from './+types/EditProjectPage';

export async function clientLoader({ context, params }: Route.ClientLoaderArgs) {
  const { apolloClient } = context.get(appContext);
  return loadQuery(apolloClient, ProjectPageQueryDocument, { projectId: params.projectId });
}

export async function clientAction({ context, request }: Route.ClientActionArgs) {
  const { apolloClient } = context.get(appContext);
  const { projectId, projectAttributes } = (await request.json()) as {
    projectId: string;
    projectAttributes: ProjectAttributes;
  };

  return withApolloErrors(async () => {
    await apolloClient.mutate({
      mutation: UpdateProjectDocument,
      variables: { id: projectId, projectAttributes },
    });
    return { saved: true };
  });
}

export default function EditProjectPage({ loaderData: data }: Route.ComponentProps) {
  const [project, setProject] = useState(data.project);
  const saveFetcher = useFetcher<typeof clientAction>();
  const location = useLocation();
  const navigate = useNavigate();
  const history = useMemo(() => ({ replace: navigate }), [navigate]);
  const [showSaved, setShowSaved] = useState(false);

  // show "Saved!" on the button for a few seconds once a save has gone through
  useEffect(() => {
    if (saveFetcher.state === 'idle' && saveFetcher.data && 'saved' in saveFetcher.data) {
      setShowSaved(true);
      const timeout = window.setTimeout(() => setShowSaved(false), 5000);
      return () => window.clearTimeout(timeout);
    }
  }, [saveFetcher.state, saveFetcher.data]);

  const saveSubmitted = (event: FormEvent) => {
    event.preventDefault();
    saveFetcher.submit(
      { projectId: project.id, projectAttributes: buildProjectAttributes(project) },
      { method: 'post', encType: 'application/json' },
    );
  };

  const { selectedTab, setSelectedTab, tabs } = useTabsWithRouter(
    [
      {
        id: 'properties',
        name: 'Project properties',
        renderContent: function ProjectPropertiesTab() {
          return (
            <section className="p-2 bg-light border border-color-light border-top-0">
              <Form method="post" onSubmit={saveSubmitted}>
                <ProjectFormFields licenseOptions={data.licenses} onChange={setProject} project={project} />
                <button className="btn btn-primary" type="submit" disabled={saveFetcher.state !== 'idle'}>
                  {showSaved ? (
                    <>
                      Saved! <i className="bi-check" />
                    </>
                  ) : (
                    'Save changes'
                  )}
                </button>
                <ErrorDisplay graphQLError={getApolloActionError(saveFetcher.data)} />
              </Form>
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
              <ProjectContentFields project={data.project} />
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
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: formatPageTitle(loaderData ? `Editing ${loaderData.project.title}` : 'Edit project') }];
}
