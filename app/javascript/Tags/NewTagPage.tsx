import { ErrorDisplay } from '@neinteractiveliterature/litform';
import { useState, type FormEvent } from 'react';
import { Form, redirect, useNavigation, useSubmit } from 'react-router';
import { appContext } from '../appContext';
import { getApolloActionError, withApolloErrors } from '../actionHelpers';
import type { TagAttributes } from '../graphqlTypes.generated';
import { pageTitle } from '../pageTitle';
import buildTagAttributes from './buildTagAttributes';
import { CreateTagDocument } from './mutations.generated';
import TagFormFields, { TagFormFieldsProps } from './TagFormFields';
import type { Route } from './+types/NewTagPage';

export async function clientAction({ context, request }: Route.ClientActionArgs) {
  const { apolloClient } = context.get(appContext);
  const { tagAttributes } = (await request.json()) as { tagAttributes: TagAttributes };

  return withApolloErrors(async () => {
    await apolloClient.mutate({ mutation: CreateTagDocument, variables: { tagAttributes } });
    return redirect('/tags');
  });
}

export default function NewTagPage({ actionData }: Route.ComponentProps) {
  const [tag, setTag] = useState<TagFormFieldsProps['tag']>({
    name: '',
  });
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

      <ErrorDisplay graphQLError={getApolloActionError(actionData)} />
    </Form>
  );
}

export const meta = pageTitle('New tag');
