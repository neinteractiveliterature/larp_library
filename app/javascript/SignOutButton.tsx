import { useContext, useCallback } from 'react';
import { CSRFTokensContext } from './AppRoot';

export function useSignOut() {
  const { signOutCSRFToken } = useContext(CSRFTokensContext);

  const signOut = useCallback(() => {
    const form = document.createElement('form');
    form.setAttribute('action', '/users/sign_out');
    form.setAttribute('method', 'POST');

    const authTokenInput = document.createElement('input');
    authTokenInput.setAttribute('type', 'hidden');
    authTokenInput.setAttribute('name', 'authenticity_token');
    authTokenInput.setAttribute('value', signOutCSRFToken);
    form.appendChild(authTokenInput);

    const methodInput = document.createElement('input');
    methodInput.setAttribute('type', 'hidden');
    methodInput.setAttribute('name', '_method');
    methodInput.setAttribute('value', 'DELETE');
    form.appendChild(methodInput);

    document.body.appendChild(form);
    form.submit();
  }, [signOutCSRFToken]);

  return signOut;
}

export function SignOutButton(): JSX.Element {
  const signOut = useSignOut();
  return (
    <button type="submit" className="btn btn-link" onClick={signOut}>
      Sign out
    </button>
  );
}
