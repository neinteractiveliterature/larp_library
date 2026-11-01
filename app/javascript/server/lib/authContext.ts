import type { InferSelectModel } from 'drizzle-orm';
import type { Session } from 'better-auth';
import { createContext } from 'react-router';
import type { users } from '../db/schema';

export type AuthUser = InferSelectModel<typeof users>;

/** The signed-in user for this request, or null. Set by authMiddleware. */
export const userContext = createContext<AuthUser | null>(null);
export const sessionContext = createContext<Session | null>(null);
