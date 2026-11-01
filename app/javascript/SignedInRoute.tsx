import { Outlet } from 'react-router';
import { appContext } from './appContext';
import { AppLayoutQueryDocument, type AppLayoutQueryData } from './queries.generated';
import { startSignIn } from './signIn';
import type { Route } from './+types/SignedInRoute';

/**
 * Routes under this one are for signed-in users.  A signed-out visitor is sent off to sign in, and brought back to the
 * page they asked for afterward, before any of those routes' loaders run.
 */
export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async ({ context, request }) => {
    const { apolloClient, config } = context.get(appContext);
    // the same query the layout route loads; the cache answers it unless this is the first navigation
    const { data } = await apolloClient.query<AppLayoutQueryData>({ query: AppLayoutQueryDocument });
    if (data.currentUser) {
      return;
    }

    const { pathname, search } = new URL(request.url);
    await startSignIn({ apolloClient, signInCSRFToken: config.signInCSRFToken, returnTo: `${pathname}${search}` });
    // the browser is on its way to the sign-in page; keep this navigation waiting rather than rendering anything
    await new Promise<never>(() => {});
  },
];

export default function SignedInRoute() {
  return <Outlet />;
}
