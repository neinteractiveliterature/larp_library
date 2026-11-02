import { env } from '~/.server/env';

/** Builds an absolute URL on this app's own host, for links that go in emails. */
export function absoluteUrl(path: string): string {
  return new URL(path, env.APP_URL_BASE).toString();
}
