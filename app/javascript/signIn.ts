/** Where to send a visitor to sign in, and have them come back to `returnTo` (a path on this site) afterward */
export function signInPath(returnTo?: string): string {
  return returnTo ? `/sign-in?returnTo=${encodeURIComponent(returnTo)}` : '/sign-in';
}
