import { ErrorDisplay } from '@neinteractiveliterature/litform';
import sortBy from 'lodash/sortBy';
import { useState, type FormEvent } from 'react';
import { Form, Link, redirect, useNavigation, useSubmit } from 'react-router';
import { appContext } from '../appContext';
import { loadQuery } from '../loadQuery';
import { getApolloActionError, withApolloErrors } from '../actionHelpers';
import type { BrandAttributes } from '../graphqlTypes.generated';
import { pageTitle } from '../pageTitle';
import { generateBrandPath } from '../URLGenerators';
import BrandFormFields, { BrandFormFieldsProps } from './BrandFormFields';
import { CreateBrandDocument } from './mutations.generated';
import { NewBrandQueryDocument, type NewBrandQueryData, type NewBrandQueryVariables } from './queries.generated';
import type { Route } from './+types/NewBrandPage';

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const { apolloClient } = context.get(appContext);
  return loadQuery<NewBrandQueryData, NewBrandQueryVariables>(apolloClient, NewBrandQueryDocument);
}

export async function clientAction({ context, request }: Route.ClientActionArgs) {
  const { apolloClient } = context.get(appContext);
  const { brandAttributes } = (await request.json()) as { brandAttributes: BrandAttributes };

  return withApolloErrors(async () => {
    const result = await apolloClient.mutate({ mutation: CreateBrandDocument, variables: { brandAttributes } });
    const newBrand = result.data?.createBrand?.brand;
    return newBrand ? redirect(generateBrandPath(newBrand)) : null;
  });
}

// This page is only reached through SignedInRoute, so there's always a current user
export default function NewBrandPage({ loaderData: data, actionData }: Route.ComponentProps) {
  const [brand, setBrand] = useState<BrandFormFieldsProps['brand']>({ name: '', description: '' });
  const submit = useSubmit();
  const navigation = useNavigation();
  const { currentUser } = data;

  const submitBrand = (event: FormEvent) => {
    event.preventDefault();
    submit(
      { brandAttributes: { name: brand.name, description: brand.description ?? null } },
      { method: 'post', encType: 'application/json' },
    );
  };

  return (
    <Form method="post" onSubmit={submitBrand}>
      <h1>Publish your larps</h1>
      {currentUser && currentUser.brands.length > 0 && (
        <div className="alert alert-warning">
          <p>
            <strong>Hey {currentUser.name}!</strong>
          </p>
          <p>
            You’re already signed up as a larp creator. If you want to publish a larp under an existing brand, go to the
            brand page and click “new project.” Here are your current brands:
          </p>
          <ul className="list-inline">
            {sortBy(currentUser.brands, (brand) => brand.name).map((brand) => (
              <li className="list-inline-item" key={brand.id}>
                <Link to={generateBrandPath(brand)}>{brand.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p>
        Hi! We’re really glad you’re interested in publishing your larps on Larp Library! In order to get started, you
        first need to fill out a short form to become a larp creator on this site. An administrator will review your
        submission and will get back to you as soon as possible.
      </p>
      <BrandFormFields brand={brand} onChange={setBrand} />

      <button type="submit" className="btn btn-primary" disabled={navigation.state !== 'idle'}>
        Submit
      </button>

      <ErrorDisplay graphQLError={getApolloActionError(actionData)} />
    </Form>
  );
}

export const meta = pageTitle('Publish your larps');
