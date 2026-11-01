import type { ApolloClient, DocumentNode, OperationVariables, TypedDocumentNode } from '@apollo/client';
import { ApolloError } from '@apollo/client';

/**
 * Runs a query for a route loader and returns its data.  Always asks the server (so each visit sees current data), and
 * turns "that record doesn't exist" into a 404 response, which the route's ErrorBoundary shows as a not-found page.
 */
export async function loadQuery<TData, TVariables extends OperationVariables = OperationVariables>(
  apolloClient: ApolloClient<object>,
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  variables?: TVariables,
): Promise<TData> {
  try {
    const { data } = await apolloClient.query<TData, TVariables>({ query, variables, fetchPolicy: 'network-only' });
    return data;
  } catch (error) {
    if (error instanceof ApolloError && error.graphQLErrors.some((err) => err.extensions?.code === 'NOT_FOUND')) {
      throw new Response(null, { status: 404, statusText: 'Not Found' });
    }
    throw error;
  }
}
