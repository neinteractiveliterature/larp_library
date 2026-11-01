import { useApolloClient } from '@apollo/client';
import { useContext, useCallback, type JSX } from 'react';
import { CSRFTokensContext } from './CSRFTokensContext';
import { startSignIn } from './signIn';

export function useSignIn() {
  const { signInCSRFToken } = useContext(CSRFTokensContext);
  const apolloClient = useApolloClient();

  const signIn = useCallback(
    (returnTo?: string) => startSignIn({ apolloClient, signInCSRFToken, returnTo }),
    [apolloClient, signInCSRFToken],
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
