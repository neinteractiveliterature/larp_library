import { Tabs, useTabsWithRouter } from '@neinteractiveliterature/litform';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { data, Form, Link, useFetcher, useLocation, useNavigate } from 'react-router';
import ActionErrorDisplay from '~/ActionErrorDisplay';
import { LICENSES } from '~/licenses';
import { formatPageTitle } from '~/pageTitle';
import { abilityContext } from '~/server/lib/authContext';
import { readDbContext } from '~/server/lib/dbContext';
import { findProjectPage, updateProject } from '~/server/lib/projects.server';
import { generateProjectPath } from '~/URLGenerators';
import { buildProjectAttributes } from '~/Project/buildProjectAttributes';
import ProjectContentFields from '~/Project/ProjectContentFields';
import ProjectFormFields from '~/Project/ProjectFormFields';
import type { Route } from './+types/EditProjectPage';

export function loader({ context, params }: Route.LoaderArgs) {
  return findProjectPage(context.get(readDbContext), context.get(abilityContext), params.projectId, { editing: true });
}

export async function action({ context, request }: Route.ActionArgs) {
  const { projectId, projectAttributes } = await request.json();

  const result = await updateProject(context.get(abilityContext), projectId, projectAttributes);
  return result.ok ? { saved: true } : data({ errors: result.errors }, { status: 422 });
}

export default function EditProjectPage({ loaderData }: Route.ComponentProps) {
  const [project, setProject] = useState(loaderData.project);
  const saveFetcher = useFetcher<typeof action>();
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
                <ProjectFormFields licenseOptions={LICENSES} onChange={setProject} project={project} />
                <button className="btn btn-primary" type="submit" disabled={saveFetcher.state !== 'idle'}>
                  {showSaved ? (
                    <>
                      Saved! <i className="bi-check" />
                    </>
                  ) : (
                    'Save changes'
                  )}
                </button>
                <ActionErrorDisplay data={saveFetcher.data} />
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
              <ProjectContentFields project={loaderData.project} />
            </section>
          );
        },
      },
    ],
    `${generateProjectPath(loaderData.project)}/edit`,
    location,
    history,
    'properties',
  );

  return (
    <>
      <h1>Editing project “{loaderData.project.title}”</h1>
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
