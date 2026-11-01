import { auth } from '../lib/auth.server';
import type { Route } from './+types/authApi';

// better-auth's own endpoints (OAuth callbacks, session lookup and so on), all under /api/auth
export function loader({ request }: Route.LoaderArgs) {
  return auth.handler(request);
}

export function action({ request }: Route.ActionArgs) {
  return auth.handler(request);
}
