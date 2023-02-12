import { useContext, useCallback } from 'react';
import { CSRFTokensContext } from './AppRoot';
import { useSetReturnUrlMutation } from './mutations.generated';

export function useSignIn() {
  const { signInCSRFToken } = useContext(CSRFTokensContext);
  const [setReturnUrl] = useSetReturnUrlMutation();

  const signIn = useCallback(
    async (returnTo?: string) => {
      if (returnTo) {
        await setReturnUrl({
          variables: {
            returnUrl: returnTo,
          },
        });
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
    },
    [signInCSRFToken, setReturnUrl],
  );

  return signIn;
}

export function SignInButton(): JSX.Element {
  const signIn = useSignIn();
  return (
    <button className="btn btn-link" type="submit" onClick={() => signIn()}>
      Sign in
    </button>
  );
}
