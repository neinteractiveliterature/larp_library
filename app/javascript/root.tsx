import { PageLoadingIndicator } from '@neinteractiveliterature/litform';
import { useEffect } from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from 'react-router';
import { appContext, type AppContextValue } from './appContext';
import { fetchAppConfig } from './appConfig';
import AppProviders from './AppProviders';
import { initSentry } from './initSentry';
import { createLarpLibraryApolloClient } from './larpLibraryApolloClient';
import { formatPageTitle } from './pageTitle';
import RouteErrorDisplay from './RouteErrorDisplay';
import { env } from './server/env';
import { userContext } from './server/lib/authContext';
import { authMiddleware } from './server/lib/authMiddleware';
import type { Route } from './+types/root';

import './styles/application.scss';

// pages override this with their own `meta`
export function meta() {
  return [{ title: formatPageTitle() }];
}

// The app configuration and Apollo client are needed by every loader, and loaders for sibling routes run in parallel,
// so they're set up in middleware (which runs before them) rather than in this route's own loader.  Middleware runs
// on every navigation, but the configuration only has to be fetched once per page load.
let appContextValue: Promise<AppContextValue> | undefined;

function loadAppContextValue(): Promise<AppContextValue> {
  appContextValue ??= fetchAppConfig().then((config) => ({
    config,
    apolloClient: createLarpLibraryApolloClient(config.graphqlCSRFToken),
  }));
  // if loading the configuration failed, let the next navigation try again
  appContextValue.catch(() => {
    appContextValue = undefined;
  });
  return appContextValue;
}

// Looks up who's signed in (and what they may do) before any loader runs
export const middleware: Route.MiddlewareFunction[] = [authMiddleware];

export function loader({ context }: Route.LoaderArgs) {
  return { sentryDsn: env.SENTRY_DSN ?? null, currentUserId: context.get(userContext)?.id ?? null };
}

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async ({ context }) => {
    context.set(appContext, await loadAppContextValue());
  },
];

export async function clientLoader({ context, serverLoader }: Route.ClientLoaderArgs) {
  return { ...(await serverLoader()), ...context.get(appContext) };
}
clientLoader.hydrate = true as const;

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

export function HydrateFallback() {
  return <PageLoadingIndicator visible iconSet="bootstrap-icons" />;
}

export default function Root() {
  const { config, apolloClient, sentryDsn, currentUserId } = useLoaderData<typeof clientLoader>();

  useEffect(() => initSentry(sentryDsn, currentUserId), [sentryDsn, currentUserId]);

  return (
    <AppProviders config={config} apolloClient={apolloClient}>
      <Outlet />
    </AppProviders>
  );
}

/** The last resort: something outside the site layout failed, e.g. loading the app configuration */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <div className="container">
      <RouteErrorDisplay error={error} />
    </div>
  );
}
