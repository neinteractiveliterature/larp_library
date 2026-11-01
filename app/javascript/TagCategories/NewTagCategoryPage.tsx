import { useState, type FormEvent } from 'react';
import { data, Form, redirect, useNavigation, useSubmit } from 'react-router';
import ActionErrorDisplay from '../ActionErrorDisplay';
import { pageTitle } from '../pageTitle';
import { abilityContext } from '../server/lib/authContext';
import { requireAbility } from '../server/lib/authorization.server';
import { createTagCategory } from '../server/lib/tagCategories.server';
import buildTagCategoryAttributes from './buildTagCategoryAttributes';
import TagCategoryFormFields, { type TagCategoryFormValues } from './TagCategoryFormFields';
import type { Route } from './+types/NewTagCategoryPage';

export function loader({ context }: Route.LoaderArgs) {
  requireAbility(context.get(abilityContext), 'create', 'TagCategory');
  return null;
}

export async function action({ context, request }: Route.ActionArgs) {
  const { tagCategoryAttributes } = await request.json();

  const result = await createTagCategory(context.get(abilityContext), tagCategoryAttributes);
  return result.ok ? redirect('/tag_categories') : data({ errors: result.errors }, { status: 422 });
}

export default function NewTagCategoryPage({ actionData }: Route.ComponentProps) {
  const [tagCategory, setTagCategory] = useState<TagCategoryFormValues>({ name: '' });
  const submit = useSubmit();
  const navigation = useNavigation();

  const createSubmitted = (event: FormEvent) => {
    event.preventDefault();
    submit(
      { tagCategoryAttributes: buildTagCategoryAttributes(tagCategory) },
      { method: 'post', encType: 'application/json' },
    );
  };

  return (
    <Form method="post" onSubmit={createSubmitted}>
      <header className="d-flex">
        <h1>Create a new tag category</h1>
      </header>

      <TagCategoryFormFields tagCategory={tagCategory} onChange={setTagCategory} />

      <button type="submit" className="btn btn-primary" disabled={navigation.state !== 'idle'}>
        Create tag category
      </button>

      <ActionErrorDisplay data={actionData} />
    </Form>
  );
}

export const meta = pageTitle('New tag category');
