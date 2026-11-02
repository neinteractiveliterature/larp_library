import { useEffect } from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from 'react-router';
import AppProviders from '~/components/AppProviders';
import { initSentry } from '~/lib/initSentry';
import { formatPageTitle } from '~/lib/pageTitle';
import RouteErrorDisplay from '~/components/RouteErrorDisplay';
import { env } from '~/server/env';
import { userContext } from '~/server/lib/authContext';
import { authMiddleware } from '~/server/lib/authMiddleware';
import type { Route } from './+types/root';

import '~/styles/application.scss';

// pages override this with their own `meta`
export function meta() {
  return [{ title: formatPageTitle() }];
}

// Looks up who's signed in (and what they may do) before any loader runs
export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export function loader({ context }: Route.LoaderArgs) {
  return { sentryDsn: env.SENTRY_DSN ?? null, currentUserId: context.get(userContext)?.id ?? null };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  const { sentryDsn, currentUserId } = useLoaderData<typeof loader>();

  useEffect(() => initSentry(sentryDsn, currentUserId), [sentryDsn, currentUserId]);

  return (
    <AppProviders>
      <Outlet />
    </AppProviders>
  );
}

/** The last resort: something outside the site layout failed */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <div className="container">
      <RouteErrorDisplay error={error} />
    </div>
  );
}
