import * as Sentry from '@sentry/browser';

declare global {
  interface Window {
    larpLibrarySentryDsn?: string;
    larpLibraryCurrentUserId?: number;
  }
}

if (window.larpLibrarySentryDsn) {
  Sentry.init({ dsn: window.larpLibrarySentryDsn });

  if (window.larpLibraryCurrentUserId != null) {
    Sentry.setUser({ id: String(window.larpLibraryCurrentUserId) });
  }
}
