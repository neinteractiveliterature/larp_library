import { useApolloClient } from '@apollo/client';
import {
  ErrorDisplay,
  LoadQueryWrapper,
  useGraphQLConfirm,
} from '@neinteractiveliterature/litform';
import { useState } from 'react';
import AsyncSelect from 'react-select/async';
import {
  ProjectSearchQueryData,
  ProjectSearchQueryDocument,
  ProjectSearchQueryVariables,
} from '../ProjectSearch/queries.generated';
import { usePromoteProjectMutation, useUnpromoteProjectMutation } from './mutations.generated';
import {
  ProjectPromotionsPageQueryData,
  ProjectPromotionsPageQueryDocument,
  useProjectPromotionsPageQuery,
} from './queries.generated';

type ProjectSearchProject = ProjectSearchQueryData['projects']['edges'][number]['node'];

export default LoadQueryWrapper(
  useProjectPromotionsPageQuery,
  function ProjectPromotionsPage({ data }) {
    const confirm = useGraphQLConfirm();
    const apolloClient = useApolloClient();
    const [projectToPromote, setProjectToPromote] = useState<ProjectSearchProject | null>(null);
    const [promoteProject, { loading: promotingProject, error: promoteProjectError }] =
      usePromoteProjectMutation();
    const [unpromoteProject] = useUnpromoteProjectMutation();

    const queryProjects = async (queryString: string) => {
      const result = await apolloClient.query<ProjectSearchQueryData, ProjectSearchQueryVariables>({
        query: ProjectSearchQueryDocument,
        variables: { queryString },
        fetchPolicy: 'network-only',
      });

      return result.data.projects.edges.map((edge) => edge.node);
    };

    const promoteProjectConfirmed = async () => {
      if (projectToPromote == null) {
        return;
      }

      await promoteProject({
        variables: { projectId: projectToPromote.id },
        update: (cache, mutationResult) => {
          const queryData = cache.readQuery<ProjectPromotionsPageQueryData>({
            query: ProjectPromotionsPageQueryDocument,
          });
          const newProjectPromotion = mutationResult.data?.promoteProject?.projectPromotion;
          if (queryData && newProjectPromotion) {
            cache.writeQuery<ProjectPromotionsPageQueryData>({
              query: ProjectPromotionsPageQueryDocument,
              data: {
                ...queryData,
                projectPromotions: [...queryData.projectPromotions, newProjectPromotion],
              },
            });
          }
        },
      });

      setProjectToPromote(null);
    };

    const unpromoteProjectConfirmed = async (
      projectPromotion: typeof data['projectPromotions'][number],
    ) => {
      await unpromoteProject({
        variables: { projectId: projectPromotion.project.id },
        update: (cache) => {
          const queryData = cache.readQuery<ProjectPromotionsPageQueryData>({
            query: ProjectPromotionsPageQueryDocument,
          });
          if (queryData) {
            cache.writeQuery<ProjectPromotionsPageQueryData>({
              query: ProjectPromotionsPageQueryDocument,
              data: {
                ...queryData,
                projectPromotions: queryData.projectPromotions.filter(
                  (existingPromotion) =>
                    existingPromotion.project.id !== projectPromotion.project.id,
                ),
              },
            });
          }
        },
      });
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
                  onClick={promoteProjectConfirmed}
                  disabled={projectToPromote == null || promotingProject}
                >
                  Promote
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>
                <ErrorDisplay graphQLError={promoteProjectError} />
              </td>
            </tr>
          </tfoot>
        </table>
      </>
    );
  },
);
