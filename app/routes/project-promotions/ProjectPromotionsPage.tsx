import { useConfirm } from '@neinteractiveliterature/litform';
import { useEffect, useState } from 'react';
import { data, useFetcher } from 'react-router';
import AsyncSelect from 'react-select/async';
import ActionErrorDisplay from '~/components/ActionErrorDisplay';
import { pageTitle } from '~/lib/pageTitle';
import { abilityContext } from '~/.server/lib/authContext';
import { requireAbility } from '~/.server/lib/authorization.server';
import { readDbContext } from '~/.server/lib/dbContext';
import { listProjectPromotions, promoteProject, unpromoteProject } from '~/.server/lib/projectPromotions.server';
import type { Route } from './+types/ProjectPromotionsPage';

type ProjectOption = { id: number; title: string | null };

export async function loader({ context }: Route.LoaderArgs) {
  requireAbility(context.get(abilityContext), 'create', 'ProjectPromotion');
  return { projectPromotions: await listProjectPromotions(context.get(readDbContext)) };
}

export async function action({ context, request }: Route.ActionArgs) {
  const ability = context.get(abilityContext);
  const { intent, projectId } = await request.json();

  // React Router reloads the list afterward, so the promotion appears or disappears
  if (intent === 'unpromote') {
    await unpromoteProject(ability, projectId);
    return { done: intent };
  }

  const result = await promoteProject(ability, projectId);
  return result.ok ? { done: intent } : data({ errors: result.errors }, { status: 422 });
}

async function queryProjects(queryString: string): Promise<ProjectOption[]> {
  const response = await fetch(`/project_promotions/projects?q=${encodeURIComponent(queryString)}`, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Could not search projects (${response.status})`);
  }
  return response.json();
}

const jsonPost = { method: 'post', encType: 'application/json' } as const;

export default function ProjectPromotionsPage({ loaderData }: Route.ComponentProps) {
  const confirm = useConfirm();
  const [projectToPromote, setProjectToPromote] = useState<ProjectOption | null>(null);
  const promoteFetcher = useFetcher<typeof action>();
  const unpromoteFetcher = useFetcher<typeof action>();

  // once a project has been promoted, clear the project picker for the next one
  useEffect(() => {
    if (promoteFetcher.state === 'idle' && promoteFetcher.data && 'done' in promoteFetcher.data) {
      setProjectToPromote(null);
    }
  }, [promoteFetcher.state, promoteFetcher.data]);

  const promoteSelectedProject = () => {
    if (projectToPromote == null) {
      return;
    }

    promoteFetcher.submit({ intent: 'promote', projectId: projectToPromote.id }, jsonPost);
  };

  const unpromoteProjectConfirmed = async (projectPromotion: (typeof loaderData.projectPromotions)[number]) => {
    await unpromoteFetcher.submit({ intent: 'unpromote', projectId: projectPromotion.project.id }, jsonPost);
  };

  return (
    <>
      <h1>Project promotions</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Promotion started</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loaderData.projectPromotions.map((projectPromotion) => (
            <tr key={projectPromotion.id}>
              <td>{projectPromotion.project.title}</td>
              <td>{new Intl.DateTimeFormat(undefined, { dateStyle: 'short' }).format(projectPromotion.createdAt)}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={unpromoteFetcher.state !== 'idle'}
                  onClick={() =>
                    confirm({
                      prompt: `Are you sure you want to stop promoting ${projectPromotion.project.title}?`,
                      action: () => unpromoteProjectConfirmed(projectPromotion),
                    })
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={2}>
              <AsyncSelect<ProjectOption>
                isClearable
                placeholder="Select a project to promote..."
                loadOptions={queryProjects}
                value={projectToPromote}
                onChange={(newValue) => setProjectToPromote(newValue)}
                getOptionValue={(option) => option.title ?? ''}
                getOptionLabel={(option) => option.title ?? ''}
                styles={{
                  container: (provided) => ({
                    ...provided,
                    zIndex: 1100,
                  }),
                }}
              />
            </td>
            <td>
              <button
                type="button"
                className="btn btn-primary"
                onClick={promoteSelectedProject}
                disabled={projectToPromote == null || promoteFetcher.state !== 'idle'}
              >
                Promote
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3}>
              <ActionErrorDisplay data={promoteFetcher.data} />
              <ActionErrorDisplay data={unpromoteFetcher.data} />
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}

export const meta = pageTitle('Project promotions');
