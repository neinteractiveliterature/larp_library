import { PageLoadingIndicator } from '@neinteractiveliterature/litform';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from 'react-router';
import { appContext, type AppContextValue } from './appContext';
import { fetchAppConfig } from './appConfig';
import AppProviders from './AppProviders';
import { initSentry } from './initSentry';
import { createLarpLibraryApolloClient } from './larpLibraryApolloClient';
import { formatPageTitle } from './pageTitle';
import RouteErrorDisplay from './RouteErrorDisplay';
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
  appContextValue ??= fetchAppConfig().then((config) => {
    initSentry(config.sentryDsn, config.currentUserId);
    return { config, apolloClient: createLarpLibraryApolloClient(config.graphqlCSRFToken) };
  });
  // if loading the configuration failed, let the next navigation try again
  appContextValue.catch(() => {
    appContextValue = undefined;
  });
  return appContextValue;
}

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async ({ context }) => {
    context.set(appContext, await loadAppContextValue());
  },
];

export function clientLoader({ context }: Route.ClientLoaderArgs) {
  return context.get(appContext);
}
clientLoader.hydrate = true as const;

// This runs at build time to produce the static HTML shell (the app is a single-page app: `ssr: false`), so everything
// here has to be the same for every visitor.
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
  const { config, apolloClient } = useLoaderData<typeof clientLoader>();

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
