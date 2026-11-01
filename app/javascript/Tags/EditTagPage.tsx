import { ErrorDisplay, useGraphQLConfirm } from '@neinteractiveliterature/litform';
import { useState, type FormEvent } from 'react';
import { Form, Link, redirect, useFetcher } from 'react-router';
import { appContext } from '../appContext';
import { getApolloActionError, withApolloErrors } from '../actionHelpers';
import type { TagAttributes } from '../graphqlTypes.generated';
import { formatPageTitle } from '../pageTitle';
import buildTagAttributes from './buildTagAttributes';
import { DeleteTagDocument, UpdateTagDocument } from './mutations.generated';
import { EditTagQueryDocument, type EditTagQueryData, type EditTagQueryVariables } from './queries.generated';
import TagFormFields from './TagFormFields';
import type { Route } from './+types/EditTagPage';

export async function clientLoader({ context, params }: Route.ClientLoaderArgs) {
  const { apolloClient } = context.get(appContext);
  const { data } = await apolloClient.query<EditTagQueryData, EditTagQueryVariables>({
    query: EditTagQueryDocument,
    variables: { id: params.tagId },
    fetchPolicy: 'network-only',
  });
  return data;
}

type EditTagActionBody = { intent: 'save'; tagAttributes: TagAttributes } | { intent: 'delete' };

export async function clientAction({ context, params, request }: Route.ClientActionArgs) {
  const { apolloClient } = context.get(appContext);
  const body = (await request.json()) as EditTagActionBody;

  return withApolloErrors(async () => {
    if (body.intent === 'delete') {
      await apolloClient.mutate({ mutation: DeleteTagDocument, variables: { id: params.tagId } });
    } else {
      await apolloClient.mutate({
        mutation: UpdateTagDocument,
        variables: { id: params.tagId, tagAttributes: body.tagAttributes },
      });
    }
    return redirect('/tags');
  });
}

export default function EditTagPage({ loaderData: data }: Route.ComponentProps) {
  const [tag, setTag] = useState(data.tag);
  const saveFetcher = useFetcher<typeof clientAction>();
  const deleteFetcher = useFetcher<typeof clientAction>();
  const confirm = useGraphQLConfirm();

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
              Used by {tag.projects.totalCount} {tag.projects.totalCount === 1 ? 'project' : 'projects'}
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
                prompt: `Are you sure you want to delete the tag ${data.tag.name}?`,
              })
            }
          >
            Delete tag
          </button>
          <ErrorDisplay graphQLError={getApolloActionError(deleteFetcher.data)} />
        </div>
      </header>

      <Form method="post" onSubmit={saveSubmitted}>
        <TagFormFields tag={tag} onChange={setTag} />

        <button type="submit" className="btn btn-primary" disabled={saveFetcher.state !== 'idle'}>
          Save changes
        </button>

        <ErrorDisplay graphQLError={getApolloActionError(saveFetcher.data)} />
      </Form>
    </>
  );
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: formatPageTitle(loaderData ? `Editing tag: ${loaderData.tag.name}` : 'Edit tag') }];
}
