import type { InferSelectModel } from 'drizzle-orm';
import type { Session } from 'better-auth';
import { createContext } from 'react-router';
import type { users } from '~/server/db/schema';
import type { AppAbility } from '~/server/lib/authorization.server';

export type AuthUser = InferSelectModel<typeof users>;

/** The signed-in user for this request, or null. Set by authMiddleware. */
export const userContext = createContext<AuthUser | null>(null);
export const sessionContext = createContext<Session | null>(null);

/**
 * What the current user may do. Set by authMiddleware for every request, so unlike userContext it has no default: reading
 * it somewhere authMiddleware didn't run should fail loudly rather than quietly grant or deny things.
 *
 * (Only the type comes from authorization.server, so route modules can import this file without pulling server-only code
 * into the browser bundle.)
 */
export const abilityContext = createContext<AppAbility>();
