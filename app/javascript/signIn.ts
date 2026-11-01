import type { ApolloClient } from '@apollo/client';
import { SetReturnUrlDocument } from './mutations.generated';

/**
 * Sends the visitor to sign in, by posting the sign-in form to Rails (which redirects on to the identity provider).
 * If `returnTo` is given, Rails is told to bring them back there afterward.  The browser leaves the page, so callers
 * shouldn't expect anything to happen after this.
 */
export async function startSignIn({
  apolloClient,
  signInCSRFToken,
  returnTo,
}: {
  apolloClient: ApolloClient<object>;
  signInCSRFToken: string;
  returnTo?: string;
}) {
  if (returnTo) {
    await apolloClient.mutate({ mutation: SetReturnUrlDocument, variables: { returnUrl: returnTo } });
  }

  const form = document.createElement('form');
  form.setAttribute('action', '/users/auth/intercode');
  form.setAttribute('method', 'POST');

  const authTokenInput = document.createElement('input');
  authTokenInput.setAttribute('type', 'hidden');
  authTokenInput.setAttribute('name', 'authenticity_token');
  authTokenInput.setAttribute('value', signInCSRFToken);
  form.appendChild(authTokenInput);

  document.body.appendChild(form);
  form.submit();
}
