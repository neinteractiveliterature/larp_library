import { useState, type FormEvent } from 'react';
import { data, Form, redirect, useNavigation, useSubmit } from 'react-router';
import ActionErrorDisplay from '~/components/ActionErrorDisplay';
import { LICENSES } from '~/lib/licenses';
import { pageTitle } from '~/lib/pageTitle';
import { abilityContext } from '~/.server/lib/authContext';
import { readDbContext } from '~/.server/lib/dbContext';
import { createProject, findBrandForNewProject } from '~/.server/lib/projects.server';
import { generateProjectPath } from '~/lib/URLGenerators';
import { buildProjectAttributes } from '~/lib/project/buildProjectAttributes';
import ProjectFormFields, { type ProjectFormValues } from '~/components/project/ProjectFormFields';
import type { Route } from './+types/NewProjectPage';

export function loader({ context, params }: Route.LoaderArgs) {
  return findBrandForNewProject(context.get(readDbContext), context.get(abilityContext), params.brandSlug);
}

export async function action({ context, request }: Route.ActionArgs) {
  const { brandId, projectAttributes } = await request.json();

  const result = await createProject(context.get(abilityContext), brandId, projectAttributes);
  return result.ok
    ? redirect(`${generateProjectPath(result.project)}/initial_content`)
    : data({ errors: result.errors }, { status: 422 });
}

export default function NewProjectPage({ loaderData, actionData }: Route.ComponentProps) {
  const [project, setProject] = useState<ProjectFormValues>({
    tags: [],
  });
  const submit = useSubmit();
  const navigation = useNavigation();

  const saveSubmitted = (event: FormEvent) => {
    event.preventDefault();
    submit(
      { brandId: loaderData.brand.id, projectAttributes: buildProjectAttributes(project) },
      { method: 'post', encType: 'application/json' },
    );
  };

  return (
    <Form method="post" onSubmit={saveSubmitted}>
      <ProjectFormFields licenseOptions={LICENSES} onChange={setProject} project={project} />
      <button className="btn btn-primary" type="submit" disabled={navigation.state !== 'idle'}>
        Save project
      </button>
      <ActionErrorDisplay data={actionData} />
    </Form>
  );
}

export const meta = pageTitle('New project');
