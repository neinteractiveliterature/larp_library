import { useApolloClient } from '@apollo/client';
import { ErrorDisplay, useGraphQLConfirm } from '@neinteractiveliterature/litform';
import { useEffect, useState } from 'react';
import { useFetcher } from 'react-router';
import AsyncSelect from 'react-select/async';
import { appContext } from '../appContext';
import { getApolloActionError, withApolloErrors } from '../actionHelpers';
import { loadQuery } from '../loadQuery';
import { pageTitle } from '../pageTitle';
import { ProjectSearchQueryDocument, type ProjectSearchQueryData } from '../ProjectSearch/queries.generated';
import { PromoteProjectMutationDocument, UnpromoteProjectMutationDocument } from './mutations.generated';
import { ProjectPromotionsPageQueryDocument } from './queries.generated';
import type { Route } from './+types/ProjectPromotionsPage';

type ProjectSearchProject = ProjectSearchQueryData['projects']['edges'][number]['node'];

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const { apolloClient } = context.get(appContext);
  return loadQuery(apolloClient, ProjectPromotionsPageQueryDocument);
}

type ProjectPromotionsActionBody = { intent: 'promote' | 'unpromote'; projectId: string };

export async function clientAction({ context, request }: Route.ClientActionArgs) {
  const { apolloClient } = context.get(appContext);
  const { intent, projectId } = (await request.json()) as ProjectPromotionsActionBody;

  // React Router reloads the list afterward, so the promotion appears or disappears
  return withApolloErrors(async () => {
    await apolloClient.mutate({
      mutation: intent === 'promote' ? PromoteProjectMutationDocument : UnpromoteProjectMutationDocument,
      variables: { projectId },
    });
    return { done: intent };
  });
}

const jsonPost = { method: 'post', encType: 'application/json' } as const;

export default function ProjectPromotionsPage({ loaderData: data }: Route.ComponentProps) {
  const confirm = useGraphQLConfirm();
  const apolloClient = useApolloClient();
  const [projectToPromote, setProjectToPromote] = useState<ProjectSearchProject | null>(null);
  const promoteFetcher = useFetcher<typeof clientAction>();
  const unpromoteFetcher = useFetcher<typeof clientAction>();

  // once a project has been promoted, clear the project picker for the next one
  useEffect(() => {
    if (promoteFetcher.state === 'idle' && promoteFetcher.data && 'done' in promoteFetcher.data) {
      setProjectToPromote(null);
    }
  }, [promoteFetcher.state, promoteFetcher.data]);

  const queryProjects = async (queryString: string) => {
    const result = await apolloClient.query({
      query: ProjectSearchQueryDocument,
      variables: { queryString },
      fetchPolicy: 'network-only',
    });

    return result.data.projects.edges.map((edge) => edge.node);
  };

  const promoteSelectedProject = () => {
    if (projectToPromote == null) {
      return;
    }

    promoteFetcher.submit({ intent: 'promote', projectId: projectToPromote.id }, jsonPost);
  };

  const unpromoteProjectConfirmed = async (projectPromotion: (typeof data)['projectPromotions'][number]) => {
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
          {data.projectPromotions.map((projectPromotion) => (
            <tr key={projectPromotion.id}>
              <td>{projectPromotion.project.title}</td>
              <td>
                {new Intl.DateTimeFormat(undefined, { dateStyle: 'short' }).format(
                  new Date(projectPromotion.createdAt),
                )}
              </td>
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
              <AsyncSelect<ProjectSearchProject>
                isClearable
                placeholder="Select a project to promote..."
                loadOptions={(inputValue: string) => queryProjects(inputValue)}
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
              <ErrorDisplay graphQLError={getApolloActionError(promoteFetcher.data)} />
              <ErrorDisplay graphQLError={getApolloActionError(unpromoteFetcher.data)} />
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}

export const meta = pageTitle('Project promotions');
