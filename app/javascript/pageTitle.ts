export const SITE_NAME = 'Larp Library';

/** Formats a page title for the browser tab, e.g. "Larps | Larp Library" */
export function formatPageTitle(pageName?: string | null): string {
  return pageName ? `${pageName} | ${SITE_NAME}` : SITE_NAME;
}

/** A route module `meta` export for a page whose title doesn't depend on loaded data */
export function pageTitle(pageName: string) {
  return () => [{ title: formatPageTitle(pageName) }];
}
