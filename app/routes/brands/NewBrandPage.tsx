import { useState, type FormEvent } from 'react';
import { data, Form, Link, redirect, useNavigation, useSubmit } from 'react-router';
import ActionErrorDisplay from '~/components/ActionErrorDisplay';
import { pageTitle } from '~/lib/pageTitle';
import { abilityContext, userContext } from '~/.server/lib/authContext';
import { requireAbility } from '~/.server/lib/authorization.server';
import { createBrand, listUserBrands } from '~/.server/lib/brands.server';
import { readDbContext } from '~/.server/lib/dbContext';
import { generateBrandPath } from '~/lib/URLGenerators';
import BrandFormFields, { type BrandFormValues } from '~/components/brands/BrandFormFields';
import type { Route } from './+types/NewBrandPage';

export async function loader({ context }: Route.LoaderArgs) {
  const ability = context.get(abilityContext);
  requireAbility(ability, 'create', 'Brand');

  // (signed-in, or the ability above would have refused)
  const user = context.get(userContext);
  return {
    currentUser: user && { name: user.name, brands: await listUserBrands(context.get(readDbContext), user.id) },
  };
}

export async function action({ context, request }: Route.ActionArgs) {
  const ability = context.get(abilityContext);
  const user = context.get(userContext);
  requireAbility(ability, 'create', 'Brand');
  if (!user) {
    throw new Response('Sign in to publish your larps', { status: 403, statusText: 'Forbidden' });
  }
  const { brandAttributes } = await request.json();

  const result = await createBrand(ability, user, brandAttributes);
  return result.ok ? redirect(generateBrandPath(result.brand)) : data({ errors: result.errors }, { status: 422 });
}

// This page is only reached through SignedInRoute, so there's always a current user
export default function NewBrandPage({ loaderData: data, actionData }: Route.ComponentProps) {
  const [brand, setBrand] = useState<BrandFormValues>({ name: '', description: '' });
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
            {currentUser.brands.map((brand) => (
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

      <ActionErrorDisplay data={actionData} />
    </Form>
  );
}

export const meta = pageTitle('Publish your larps');
