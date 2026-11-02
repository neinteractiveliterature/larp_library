import { DrizzleQueryError } from 'drizzle-orm/errors';
import type { ActionErrors } from '~/lib/actionErrors';

/** What a server function that changes something returns: the result, or what the user needs to fix */
export type ActionResult<T> = ({ ok: true } & T) | ({ ok: false } & ActionErrors);

export function failure(...errors: string[]): { ok: false } & ActionErrors {
  return { ok: false, errors };
}

/**
 * The Postgres error under a failed query, if there was one. (Drizzle wraps the driver's error; its `code` and
 * `constraint` say what went wrong.)
 */
function postgresError(error: unknown): { code?: string; constraint?: string } | null {
  const cause = error instanceof DrizzleQueryError ? error.cause : error;
  return typeof cause === 'object' && cause != null ? cause : null;
}

/** Whether `error` is a violation of the unique index with this name */
export function isUniqueViolation(error: unknown, constraint: string): boolean {
  const pg = postgresError(error);
  return pg?.code === '23505' && pg.constraint === constraint;
}

/** Whether `error` is a foreign key violation: a row that points at something that doesn't exist */
export function isForeignKeyViolation(error: unknown): boolean {
  return postgresError(error)?.code === '23503';
}
