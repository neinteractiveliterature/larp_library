import { useLocation } from 'react-router';
import type { JSX } from 'react';
import { signInPath } from './signIn';

/** Signs the visitor in, and brings them back to the page they're on */
export function SignInButton(): JSX.Element {
  const location = useLocation();
  // a plain link, not a client-side navigation: sign-in redirects off to Intercode
  return (
    <a className="btn btn-link" href={signInPath(`${location.pathname}${location.search}`)}>
      Sign in
    </a>
  );
}
