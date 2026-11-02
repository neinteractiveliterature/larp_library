import { useState, type FormEvent } from 'react';
import { data, Form, redirect, useNavigation, useSubmit } from 'react-router';
import ActionErrorDisplay from '~/ActionErrorDisplay';
import { pageTitle } from '~/pageTitle';
import { abilityContext } from '~/server/lib/authContext';
import { requireAbility } from '~/server/lib/authorization.server';
import { createTag } from '~/server/lib/tags.server';
import buildTagAttributes from '~/Tags/buildTagAttributes';
import TagFormFields, { type TagFormValues } from '~/Tags/TagFormFields';
import type { Route } from './+types/NewTagPage';

export function loader({ context }: Route.LoaderArgs) {
  requireAbility(context.get(abilityContext), 'create', 'Tag');
  return null;
}

export async function action({ context, request }: Route.ActionArgs) {
  const { tagAttributes } = await request.json();

  const result = await createTag(context.get(abilityContext), tagAttributes);
  return result.ok ? redirect('/tags') : data({ errors: result.errors }, { status: 422 });
}

export default function NewTagPage({ actionData }: Route.ComponentProps) {
  const [tag, setTag] = useState<TagFormValues>({ name: '' });
  const submit = useSubmit();
  const navigation = useNavigation();

  const createSubmitted = (event: FormEvent) => {
    event.preventDefault();
    submit({ tagAttributes: buildTagAttributes(tag) }, { method: 'post', encType: 'application/json' });
  };

  return (
    <Form method="post" onSubmit={createSubmitted}>
      <header className="d-flex">
        <h1>Create a new tag</h1>
      </header>

      <TagFormFields tag={tag} onChange={setTag} />

      <button type="submit" className="btn btn-primary" disabled={navigation.state !== 'idle'}>
        Create tag
      </button>

      <ActionErrorDisplay data={actionData} />
    </Form>
  );
}

export const meta = pageTitle('New tag');
