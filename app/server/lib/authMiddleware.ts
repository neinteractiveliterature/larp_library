import type { MiddlewareFunction } from 'react-router';
import { auth } from '~/server/lib/auth.server';
import { abilityContext, sessionContext, userContext } from '~/server/lib/authContext';
import { loadAbility } from '~/server/lib/authorization.server';
import { db } from '~/server/db';
import { findUserById } from '~/server/repositories/users.server';

/**
 * Loads the session from better-auth and puts the signed-in user (or null), and what they're allowed to do, in context. Register it on the root route, so
 * that it runs before anything that reads userContext or sessionContext.
 */
export const authMiddleware: MiddlewareFunction<Response> = async ({ request, context }) => {
  const session = await auth.api.getSession({ headers: request.headers });

  const user = session?.user ? await findUserById(db, session.user.id) : null;
  context.set(userContext, user);
  context.set(sessionContext, session?.session ?? null);
  context.set(abilityContext, await loadAbility(user));
};
