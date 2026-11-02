import { useConfirm } from '@neinteractiveliterature/litform';
import { useState, type FormEvent } from 'react';
import { data, Form, Link, redirect, useFetcher } from 'react-router';
import ActionErrorDisplay from '../ActionErrorDisplay';
import { formatPageTitle } from '../pageTitle';
import { abilityContext } from '../server/lib/authContext';
import { requireAbility } from '../server/lib/authorization.server';
import { readDbContext } from '../server/lib/dbContext';
import { deleteTag, findTagForEditing, updateTag } from '../server/lib/tags.server';
import buildTagAttributes from './buildTagAttributes';
import TagFormFields from './TagFormFields';
import type { Route } from './+types/EditTagPage';

function parseTagId(tagId: string): number {
  if (!/^\d+$/.test(tagId)) {
    throw new Response(null, { status: 404, statusText: 'Not Found' });
  }
  return Number(tagId);
}

export async function loader({ context, params }: Route.LoaderArgs) {
  requireAbility(context.get(abilityContext), 'update', 'Tag');

  const found = await findTagForEditing(context.get(readDbContext), parseTagId(params.tagId));
  if (!found) {
    throw new Response(null, { status: 404, statusText: 'Not Found' });
  }
  return found;
}

export async function action({ context, params, request }: Route.ActionArgs) {
  const ability = context.get(abilityContext);
  const tagId = parseTagId(params.tagId);
  const body = await request.json();

  if (body.intent === 'delete') {
    await deleteTag(ability, tagId);
    return redirect('/tags');
  }

  const result = await updateTag(ability, tagId, body.tagAttributes);
  return result.ok ? redirect('/tags') : data({ errors: result.errors }, { status: 422 });
}

export default function EditTagPage({ loaderData: { tag: loadedTag, projectCount } }: Route.ComponentProps) {
  const [tag, setTag] = useState(loadedTag);
  const saveFetcher = useFetcher<typeof action>();
  const deleteFetcher = useFetcher<typeof action>();
  const confirm = useConfirm();

  const saveSubmitted = (event: FormEvent) => {
    event.preventDefault();
    saveFetcher.submit(
      { intent: 'save', tagAttributes: buildTagAttributes(tag) },
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
          <h1>Editing tag: {tag.name}</h1>
          <p>
            <Link to={`/projects?tag=${tag.name}`}>
              Used by {projectCount} {projectCount === 1 ? 'project' : 'projects'}
            </Link>
          </p>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-danger"
            disabled={deleteFetcher.state !== 'idle'}
            onClick={() =>
              confirm({
                action: deleteConfirmed,
                prompt: `Are you sure you want to delete the tag ${loadedTag.name}?`,
              })
            }
          >
            Delete tag
          </button>
          <ActionErrorDisplay data={deleteFetcher.data} />
        </div>
      </header>

      <Form method="post" onSubmit={saveSubmitted}>
        <TagFormFields tag={tag} onChange={setTag} />

        <button type="submit" className="btn btn-primary" disabled={saveFetcher.state !== 'idle'}>
          Save changes
        </button>

        <ActionErrorDisplay data={saveFetcher.data} />
      </Form>
    </>
  );
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: formatPageTitle(loaderData ? `Editing tag: ${loaderData.tag.name}` : 'Edit tag') }];
}
