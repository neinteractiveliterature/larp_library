import { auth } from '~/.server/lib/auth.server';
import { redirectWithCookies } from '~/.server/lib/authRedirects.server';
import type { Route } from './+types/signOut';

export async function action({ request }: Route.ActionArgs) {
  const response = await auth.api.signOut({ headers: request.headers, asResponse: true });
  return redirectWithCookies('/', response);
}
