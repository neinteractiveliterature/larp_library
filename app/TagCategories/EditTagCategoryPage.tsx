import { useConfirm } from '@neinteractiveliterature/litform';
import { useState, type FormEvent } from 'react';
import { data, Form, redirect, useFetcher } from 'react-router';
import ActionErrorDisplay from '~/ActionErrorDisplay';
import { formatPageTitle } from '~/pageTitle';
import { abilityContext } from '~/server/lib/authContext';
import { requireAbility } from '~/server/lib/authorization.server';
import { readDbContext } from '~/server/lib/dbContext';
import { deleteTagCategory, findTagCategory, updateTagCategory } from '~/server/lib/tagCategories.server';
import Tag from '~/Tags/Tag';
import buildTagCategoryAttributes from '~/TagCategories/buildTagCategoryAttributes';
import TagCategoryFormFields from '~/TagCategories/TagCategoryFormFields';
import type { Route } from './+types/EditTagCategoryPage';

function parseTagCategoryId(tagCategoryId: string): number {
  if (!/^\d+$/.test(tagCategoryId)) {
    throw new Response(null, { status: 404, statusText: 'Not Found' });
  }
  return Number(tagCategoryId);
}

export async function loader({ context, params }: Route.LoaderArgs) {
  requireAbility(context.get(abilityContext), 'update', 'TagCategory');

  const found = await findTagCategory(context.get(readDbContext), parseTagCategoryId(params.tagCategoryId));
  if (!found) {
    throw new Response(null, { status: 404, statusText: 'Not Found' });
  }
  return found;
}

export async function action({ context, params, request }: Route.ActionArgs) {
  const ability = context.get(abilityContext);
  const tagCategoryId = parseTagCategoryId(params.tagCategoryId);
  const body = await request.json();

  if (body.intent === 'delete') {
    await deleteTagCategory(ability, tagCategoryId);
    return redirect('/tag_categories');
  }

  const result = await updateTagCategory(ability, tagCategoryId, body.tagCategoryAttributes);
  return result.ok ? redirect('/tag_categories') : data({ errors: result.errors }, { status: 422 });
}

export default function EditTagCategoryPage({
  loaderData: { tagCategory: loadedTagCategory, tags },
}: Route.ComponentProps) {
  const [tagCategory, setTagCategory] = useState(loadedTagCategory);
  const saveFetcher = useFetcher<typeof action>();
  const deleteFetcher = useFetcher<typeof action>();
  const confirm = useConfirm();

  const saveSubmitted = (event: FormEvent) => {
    event.preventDefault();
    saveFetcher.submit(
      { intent: 'save', tagCategoryAttributes: buildTagCategoryAttributes(tagCategory) },
      { method: 'post', encType: 'application/json' },
    );
  };

  const deleteConfirmed = async () => {
    await deleteFetcher.submit({ intent: 'delete' }, { method: 'post', encType: 'application/json' });
  };

  return (
    <>
      <header className="d-flex align-items-start">
        <div className="flex-grow-1">
          <h1>Editing tag category: {tagCategory.name}</h1>
          <ul className="list-inline">
            {tags.map((tag) => (
              <li className="list-inline-item" key={tag.id}>
                <Tag tag={tag} linkTo={`/tags/${tag.id}/edit`} />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-danger"
            disabled={deleteFetcher.state !== 'idle'}
            onClick={() =>
              confirm({
                action: deleteConfirmed,
                prompt: `Are you sure you want to delete the tag category ${loadedTagCategory.name}?`,
              })
            }
          >
            Delete tag category
          </button>
          <ActionErrorDisplay data={deleteFetcher.data} />
        </div>
      </header>

      <Form method="post" onSubmit={saveSubmitted}>
        <TagCategoryFormFields tagCategory={tagCategory} onChange={setTagCategory} />

        <button type="submit" className="btn btn-primary" disabled={saveFetcher.state !== 'idle'}>
          Save changes
        </button>

        <ActionErrorDisplay data={saveFetcher.data} />
      </Form>
    </>
  );
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    {
      title: formatPageTitle(loaderData ? `Editing tag category: ${loaderData.tagCategory.name}` : 'Edit tag category'),
    },
  ];
}
