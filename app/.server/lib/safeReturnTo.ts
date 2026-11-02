/**
 * Returns `returnTo` if it's a path on this site, and "/" otherwise. The sign-in redirect takes a path to bring the
 * visitor back to, and since that comes from the query string it must not be able to send anyone to another site (an
 * absolute URL, or a protocol-relative "//host" or "/\host" one that browsers treat the same way).
 */
export function safeReturnTo(returnTo: string | null | undefined): string {
  if (!returnTo || !returnTo.startsWith('/') || returnTo.startsWith('//') || returnTo.startsWith('/\\')) {
    return '/';
  }
  // Control characters (a tab or newline inside "//" is stripped by browsers, turning "/\t/host" into "//host")
  if ([...returnTo].some((character) => character.charCodeAt(0) < 0x20)) {
    return '/';
  }
  return returnTo;
}
