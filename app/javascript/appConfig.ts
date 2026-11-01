import type { S3ConfigurationContextValue } from './S3ConfigurationContext';

/**
 * Values that only the server knows and that can differ per request.  The app shell is a static HTML file, so these
 * come from Rails' /app_config endpoint once the page has loaded.
 */
export type AppConfig = {
  graphqlCSRFToken: string;
  signInCSRFToken: string;
  signOutCSRFToken: string;
  s3Configuration: S3ConfigurationContextValue;
  sentryDsn: string | null;
  currentUserId: number | null;
};

export async function fetchAppConfig(): Promise<AppConfig> {
  const response = await fetch('/app_config', { credentials: 'same-origin', headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Response(`Could not load app configuration (${response.status})`, { status: response.status });
  }
  return (await response.json()) as AppConfig;
}
