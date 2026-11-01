import type { MiddlewareFunction } from 'react-router';
import { auth } from './auth.server';
import { sessionContext, userContext } from './authContext';
import { getUserById } from './authUser.server';

/**
 * Loads the session from better-auth and puts the signed-in user (or null) in context. Register it on the root route, so
 * that it runs before anything that reads userContext or sessionContext.
 */
export const authMiddleware: MiddlewareFunction<Response> = async ({ request, context }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  context.set(userContext, session?.user ? await getUserById(session.user.id) : null);
  context.set(sessionContext, session?.session ?? null);
};
