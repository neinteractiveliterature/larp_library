import * as Sentry from '@sentry/browser';

export function initSentry(dsn: string | null | undefined, currentUserId?: number | null): void {
  if (!dsn) {
    return;
  }

  Sentry.init({ dsn });

  if (currentUserId != null) {
    Sentry.setUser({ id: String(currentUserId) });
  }
}
