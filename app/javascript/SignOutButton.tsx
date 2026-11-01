import type { JSX } from 'react';

export function SignOutButton(): JSX.Element {
  return (
    // A plain form rather than react-router's <Form>: signing out clears the session cookie and redirects, so this is a
    // full-page POST and everything on the page should start over, not a client-side submission.
    <form method="post" action="/sign-out">
      <button type="submit" className="btn btn-link">
        Sign out
      </button>
    </form>
  );
}
