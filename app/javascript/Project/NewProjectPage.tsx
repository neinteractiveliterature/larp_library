import { ErrorDisplay } from '@neinteractiveliterature/litform';
import { useState, type FormEvent } from 'react';
import { Form, redirect, useNavigation, useSubmit } from 'react-router';
import { appContext } from '../appContext';
import { getApolloActionError, withApolloErrors } from '../actionHelpers';
import type { ProjectAttributes } from '../graphqlTypes.generated';
import { loadQuery } from '../loadQuery';
import { pageTitle } from '../pageTitle';
import { generateProjectPath } from '../URLGenerators';
import { buildProjectAttributes } from './buildProjectAttributes';
import { CreateProjectDocument } from './mutations.generated';
import ProjectFormFields, { ProjectFormProps } from './ProjectFormFields';
import { NewProjectFormQueryDocument } from './queries.generated';
import type { Route } from './+types/NewProjectPage';

export async function clientLoader({ context, params }: Route.ClientLoaderArgs) {
  const { apolloClient } = context.get(appContext);
  return loadQuery(apolloClient, NewProjectFormQueryDocument, { slug: params.brandSlug });
}

export async function clientAction({ context, request }: Route.ClientActionArgs) {
  const { apolloClient } = context.get(appContext);
  const { brandId, projectAttributes } = (await request.json()) as {
    brandId: string;
    projectAttributes: ProjectAttributes;
  };

  return withApolloErrors(async () => {
    const result = await apolloClient.mutate({
      mutation: CreateProjectDocument,
      variables: { brandId, projectAttributes },
    });
    const newProject = result.data?.createProject?.project;
    return newProject ? redirect(`${generateProjectPath(newProject)}/initial_content`) : null;
  });
}

export default function NewProjectPage({ loaderData: data, actionData }: Route.ComponentProps) {
  const [project, setProject] = useState<ProjectFormProps['project']>({
    tags: [],
  });
  const submit = useSubmit();
  const navigation = useNavigation();

  const saveSubmitted = (event: FormEvent) => {
    event.preventDefault();
    submit(
      { brandId: data.brand.id, projectAttributes: buildProjectAttributes(project) },
      { method: 'post', encType: 'application/json' },
    );
  };

  return (
    <Form method="post" onSubmit={saveSubmitted}>
      <ProjectFormFields licenseOptions={data.licenses} onChange={setProject} project={project} />
      <button className="btn btn-primary" type="submit" disabled={navigation.state !== 'idle'}>
        Save project
      </button>
      <ErrorDisplay graphQLError={getApolloActionError(actionData)} />
    </Form>
  );
}

export const meta = pageTitle('New project');
