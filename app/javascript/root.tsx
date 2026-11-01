import { PageLoadingIndicator } from '@neinteractiveliterature/litform';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from 'react-router';
import { fetchAppConfig } from './appConfig';
import AppProviders from './AppProviders';
import { initSentry } from './initSentry';

import './styles/application.scss';

export async function clientLoader() {
  const config = await fetchAppConfig();
  initSentry(config.sentryDsn, config.currentUserId);
  return config;
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
        <title>Larp Library</title>
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
  const config = useLoaderData<typeof clientLoader>();

  return (
    <AppProviders config={config}>
      <Outlet />
    </AppProviders>
  );
}
