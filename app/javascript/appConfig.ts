import type { S3ConfigurationContextValue } from './S3ConfigurationContext';

/**
 * What the pages that still talk to Rails (through GraphQL) need from it, fetched from Rails' /app_config endpoint once the
 * page has loaded. This goes away as the pages move to server loaders and actions.
 */
export type AppConfig = {
  graphqlCSRFToken: string;
  s3Configuration: S3ConfigurationContextValue;
};

export async function fetchAppConfig(): Promise<AppConfig> {
  const response = await fetch('/app_config', { credentials: 'same-origin', headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Response(`Could not load app configuration (${response.status})`, { status: response.status });
  }
  return (await response.json()) as AppConfig;
}
