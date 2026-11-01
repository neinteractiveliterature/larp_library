import { ApolloClient, ApolloLink, InMemoryCache, HttpLink, type NormalizedCacheObject } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { relayStylePagination } from '@apollo/client/utilities';
import type { TypedTypePolicies } from './apolloClientHelpers.generated';

export const typePolicies: TypedTypePolicies = {
  Brand: {
    fields: {
      projects: relayStylePagination(),
    },
  },
  ProjectFile: {
    keyFields: ['id'],
  },
  Query: {
    fields: {
      brands: relayStylePagination(),
      projects: relayStylePagination(),
      tagCategories: relayStylePagination(),
      tags: relayStylePagination(),
    },
  },
};

export function createLarpLibraryApolloLink(authenticityToken: string, onUnauthenticated?: () => void): ApolloLink {
  const authLink = new ApolloLink((operation, next) => {
    operation.setContext((context: ReturnType<typeof operation.getContext>) => ({
      ...context,
      credentials: 'same-origin',
      headers: { ...context.headers, 'X-CSRF-Token': authenticityToken },
    }));

    return next(operation);
  });

  const errorHandlerLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors?.some((err) => (err.extensions || {}).code === 'NOT_AUTHENTICATED')) {
      onUnauthenticated?.();
    }
  });

  return ApolloLink.from([authLink, errorHandlerLink, new HttpLink({ uri: '/graphql' })]);
}

export function createLarpLibraryApolloClient(
  authenticityToken: string,
  onUnauthenticated?: () => void,
): ApolloClient<NormalizedCacheObject> {
  return new ApolloClient({
    link: createLarpLibraryApolloLink(authenticityToken, onUnauthenticated),
    cache: new InMemoryCache({ addTypename: true, typePolicies }),
  });
}
