import { ErrorDisplay } from '@neinteractiveliterature/litform';
import { useState, type FormEvent } from 'react';
import { Form, redirect, useNavigation, useSubmit } from 'react-router';
import { appContext } from '../appContext';
import { getApolloActionError, withApolloErrors } from '../actionHelpers';
import type { TagCategoryAttributes } from '../graphqlTypes.generated';
import { pageTitle } from '../pageTitle';
import buildTagCategoryAttributes from './buildTagCategoryAttributes';
import { CreateTagCategoryDocument } from './mutations.generated';
import TagCategoryFormFields, { TagCategoryFormFieldsProps } from './TagCategoryFormFields';
import type { Route } from './+types/NewTagCategoryPage';

export async function clientAction({ context, request }: Route.ClientActionArgs) {
  const { apolloClient } = context.get(appContext);
  const { tagCategoryAttributes } = (await request.json()) as { tagCategoryAttributes: TagCategoryAttributes };

  return withApolloErrors(async () => {
    await apolloClient.mutate({ mutation: CreateTagCategoryDocument, variables: { tagCategoryAttributes } });
    return redirect('/tag_categories');
  });
}

export default function NewTagCategoryPage({ actionData }: Route.ComponentProps) {
  const [tagCategory, setTagCategory] = useState<TagCategoryFormFieldsProps['tagCategory']>({
    name: '',
  });
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

      <ErrorDisplay graphQLError={getApolloActionError(actionData)} />
    </Form>
  );
}

export const meta = pageTitle('New tag category');
