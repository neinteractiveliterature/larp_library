import { auth, INTERCODE_PROVIDER_ID } from '~/server/lib/auth.server';
import { redirectWithCookies } from '~/server/lib/authRedirects.server';
import { safeReturnTo } from '~/server/lib/safeReturnTo';
import type { Route } from './+types/signIn';

/** Sends the visitor to Intercode to sign in, and brings them back to `returnTo` (a path on this site) afterward. */
export async function loader({ request }: Route.LoaderArgs) {
  const returnTo = safeReturnTo(new URL(request.url).searchParams.get('returnTo'));

  const response = await auth.api.signInSocial({
    body: { provider: INTERCODE_PROVIDER_ID, callbackURL: returnTo },
    headers: request.headers,
    asResponse: true,
  });
  const { url } = (await response.json()) as { url?: string };
  if (!url) {
    throw new Response('Could not start signing in', { status: 502 });
  }

  return redirectWithCookies(url, response);
}
