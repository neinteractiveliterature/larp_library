import { ErrorDisplay, useGraphQLConfirm } from '@neinteractiveliterature/litform';
import { useState, type FormEvent } from 'react';
import { Form, redirect, useFetcher } from 'react-router';
import { appContext } from '../appContext';
import { loadQuery } from '../loadQuery';
import { getApolloActionError, withApolloErrors } from '../actionHelpers';
import type { TagCategoryAttributes } from '../graphqlTypes.generated';
import { formatPageTitle } from '../pageTitle';
import Tag from '../Tags/Tag';
import buildTagCategoryAttributes from './buildTagCategoryAttributes';
import { DeleteTagCategoryDocument, UpdateTagCategoryDocument } from './mutations.generated';
import { EditTagCategoryQueryDocument } from './queries.generated';
import TagCategoryFormFields from './TagCategoryFormFields';
import type { Route } from './+types/EditTagCategoryPage';

export async function clientLoader({ context, params }: Route.ClientLoaderArgs) {
  const { apolloClient } = context.get(appContext);
  return loadQuery(apolloClient, EditTagCategoryQueryDocument, { id: params.tagCategoryId });
}

type EditTagCategoryActionBody =
  { intent: 'save'; tagCategoryAttributes: TagCategoryAttributes } | { intent: 'delete' };

export async function clientAction({ context, params, request }: Route.ClientActionArgs) {
  const { apolloClient } = context.get(appContext);
  const body = (await request.json()) as EditTagCategoryActionBody;

  return withApolloErrors(async () => {
    if (body.intent === 'delete') {
      await apolloClient.mutate({ mutation: DeleteTagCategoryDocument, variables: { id: params.tagCategoryId } });
    } else {
      await apolloClient.mutate({
        mutation: UpdateTagCategoryDocument,
        variables: { id: params.tagCategoryId, tagCategoryAttributes: body.tagCategoryAttributes },
      });
    }
    return redirect('/tag_categories');
  });
}

export default function EditTagCategoryPage({ loaderData: data }: Route.ComponentProps) {
  const [tagCategory, setTagCategory] = useState(data.tagCategory);
  const saveFetcher = useFetcher<typeof clientAction>();
  const deleteFetcher = useFetcher<typeof clientAction>();
  const confirm = useGraphQLConfirm();

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
            {tagCategory.tags.map((tag) => (
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
                prompt: `Are you sure you want to delete the tag category ${data.tagCategory.name}?`,
              })
            }
          >
            Delete tag category
          </button>
          <ErrorDisplay graphQLError={getApolloActionError(deleteFetcher.data)} />
        </div>
      </header>

      <Form method="post" onSubmit={saveSubmitted}>
        <TagCategoryFormFields tagCategory={tagCategory} onChange={setTagCategory} />

        <button type="submit" className="btn btn-primary" disabled={saveFetcher.state !== 'idle'}>
          Save changes
        </button>

        <ErrorDisplay graphQLError={getApolloActionError(saveFetcher.data)} />
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
