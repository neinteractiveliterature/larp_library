import { redirect } from 'react-router';

/**
 * Turns a response from one of better-auth's endpoints, called directly rather than over HTTP, into a redirect that keeps
 * the cookies the endpoint set (the OAuth state on the way out, the cleared session on sign out), and nothing else of
 * its response.
 */
export function redirectWithCookies(to: string, authResponse: Response) {
  const headers = new Headers();
  for (const cookie of authResponse.headers.getSetCookie()) {
    headers.append('Set-Cookie', cookie);
  }
  return redirect(to, { headers });
}
