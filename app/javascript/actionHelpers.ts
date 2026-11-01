import { ApolloError } from '@apollo/client';

export type ApolloActionError = { error: ApolloError };

/**
 * Runs the body of a route action.  A GraphQL failure is returned as `{ error }` so the page can show it next to the
 * form (as `actionData`); anything else is a bug and propagates to the route's ErrorBoundary.
 */
export async function withApolloErrors<T>(run: () => Promise<T>): Promise<T | ApolloActionError> {
  try {
    return await run();
  } catch (error) {
    if (error instanceof ApolloError) {
      return { error };
    }
    throw error;
  }
}

/** `actionData` or a fetcher's `data`, narrowed to the error `withApolloErrors` returns, if there was one */
export function getApolloActionError(data: unknown): ApolloError | undefined {
  return typeof data === 'object' && data != null && 'error' in data && data.error instanceof ApolloError
    ? data.error
    : undefined;
}
