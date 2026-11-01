import { Outlet, redirect } from 'react-router';
import { signInPath } from './signIn';
import { userContext } from './server/lib/authContext';
import type { Route } from './+types/SignedInRoute';

/**
 * Routes under this one are for signed-in users.  A signed-out visitor is sent off to sign in, and brought back to the
 * page they asked for afterward, before any of those routes' loaders run.
 */
export const middleware: Route.MiddlewareFunction[] = [
  ({ context, request }) => {
    if (context.get(userContext)) {
      return;
    }

    const { pathname, search } = new URL(request.url);
    throw redirect(signInPath(`${pathname}${search}`));
  },
];

export default function SignedInRoute() {
  return <Outlet />;
}
