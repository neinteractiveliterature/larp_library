import { ErrorDisplay } from '@neinteractiveliterature/litform';
import { Form, redirect, useLocation, useNavigation, useSubmit, type SubmitOptions } from 'react-router';
import { appContext } from '../appContext';
import { loadQuery } from '../loadQuery';
import { getApolloActionError, withApolloErrors } from '../actionHelpers';
import { formatPageTitle } from '../pageTitle';
import { useSignIn } from '../SignInButton';
import { generateBrandPath } from '../URLGenerators';
import { AcceptBrandMembershipInvitationDocument } from './mutations.generated';
import {
  InvitationPageQueryDocument,
  type InvitationPageQueryData,
  type InvitationPageQueryVariables,
} from './queries.generated';
import type { Route } from './+types/InvitationPage';

export async function clientLoader({ context, params }: Route.ClientLoaderArgs) {
  const { apolloClient } = context.get(appContext);
  return loadQuery<InvitationPageQueryData, InvitationPageQueryVariables>(apolloClient, InvitationPageQueryDocument, {
    brandSlug: params.brandSlug,
    invitationToken: params.invitationToken,
  });
}

export async function clientAction({ context, request }: Route.ClientActionArgs) {
  const { apolloClient } = context.get(appContext);
  const { brandId, brandSlug, invitationToken } = (await request.json()) as {
    brandId: string;
    brandSlug: string;
    invitationToken: string;
  };

  return withApolloErrors(async () => {
    await apolloClient.mutate({
      mutation: AcceptBrandMembershipInvitationDocument,
      variables: { brandId, invitationToken },
    });
    // what the user is allowed to do has just changed, so forget everything that was loaded under the old permissions
    await apolloClient.resetStore();
    return redirect(generateBrandPath({ slug: brandSlug }));
  });
}

const jsonPost: SubmitOptions = { method: 'post', encType: 'application/json' };

export default function InvitationPage({ loaderData: data, actionData, params }: Route.ComponentProps) {
  const brandName = data.brandMembership.brand.name;
  const location = useLocation();
  const submit = useSubmit();
  const navigation = useNavigation();
  const signIn = useSignIn();

  const acceptSubmitted = (event: React.FormEvent) => {
    event.preventDefault();
    submit(
      { brandId: data.brandMembership.brand.id, brandSlug: params.brandSlug, invitationToken: params.invitationToken },
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
        {data.brandMembership.admin && (
          <>
            <li>Add and remove members from {brandName}</li>
            <li>Edit the public description and branding for {brandName}</li>
          </>
        )}
      </ul>

      {data.currentUser ? (
        <Form method="post" onSubmit={acceptSubmitted}>
          <button type="submit" className="btn btn-primary" disabled={navigation.state !== 'idle'}>
            Accept invitation
          </button>
        </Form>
      ) : (
        <button type="button" onClick={() => signIn(location.pathname)} className="btn btn-primary">
          Sign in to accept this invitation
        </button>
      )}

      <ErrorDisplay graphQLError={getApolloActionError(actionData)} />
    </>
  );
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: formatPageTitle(loaderData ? `Join ${loaderData.brandMembership.brand.name}` : 'Invitation') }];
}
