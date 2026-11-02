import { data, Form, redirect, useLocation, useNavigation, useSubmit, type SubmitOptions } from 'react-router';
import ActionErrorDisplay from '~/ActionErrorDisplay';
import { formatPageTitle } from '~/pageTitle';
import { signInPath } from '~/signIn';
import { userContext } from '~/server/lib/authContext';
import { acceptInvitation, findInvitation } from '~/server/lib/brandMemberships.server';
import { readDbContext } from '~/server/lib/dbContext';
import { generateBrandPath } from '~/URLGenerators';
import type { Route } from './+types/InvitationPage';

export async function loader({ context, params }: Route.LoaderArgs) {
  const invitation = await findInvitation(context.get(readDbContext), params.brandSlug, params.invitationToken);
  const user = context.get(userContext);
  return { ...invitation, currentUser: user && { id: user.id } };
}

export async function action({ context, request }: Route.ActionArgs) {
  const { brandId, brandSlug, invitationToken } = await request.json();

  const result = await acceptInvitation(context.get(userContext), { brandId, invitationToken });
  return result.ok
    ? redirect(generateBrandPath({ slug: brandSlug }))
    : data({ errors: result.errors }, { status: 422 });
}

const jsonPost: SubmitOptions = { method: 'post', encType: 'application/json' };

export default function InvitationPage({ loaderData, actionData, params }: Route.ComponentProps) {
  const brandName = loaderData.brandMembership.brand.name;
  const location = useLocation();
  const submit = useSubmit();
  const navigation = useNavigation();

  const acceptSubmitted = (event: React.FormEvent) => {
    event.preventDefault();
    submit(
      {
        brandId: loaderData.brandMembership.brand.id,
        brandSlug: params.brandSlug,
        invitationToken: params.invitationToken,
      },
      jsonPost,
    );
  };

  return (
    <>
      <h1>Welcome to Larp Library!</h1>

      <p>
        Larp Library is a site for larp authors to publish their work under free-to-use licenses. You’ve been invited to
        join {brandName} on Larp Library.
      </p>

      <p>This membership allows you to:</p>

      <ul>
        <li>Publish larps as {brandName}</li>
        <li>Edit existing {brandName} larps</li>
        {loaderData.brandMembership.admin && (
          <>
            <li>Add and remove members from {brandName}</li>
            <li>Edit the public description and branding for {brandName}</li>
          </>
        )}
      </ul>

      {loaderData.currentUser ? (
        <Form method="post" onSubmit={acceptSubmitted}>
          <button type="submit" className="btn btn-primary" disabled={navigation.state !== 'idle'}>
            Accept invitation
          </button>
        </Form>
      ) : (
        <a href={signInPath(location.pathname)} className="btn btn-primary">
          Sign in to accept this invitation
        </a>
      )}

      <ActionErrorDisplay data={actionData} />
    </>
  );
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: formatPageTitle(loaderData ? `Join ${loaderData.brandMembership.brand.name}` : 'Invitation') }];
}
