import { useMemo, RefObject } from 'react';
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
  HttpLink,
} from '@apollo/client';
import { TypedTypePolicies } from './apolloClientHelpers.generated';
import { useAuthHeadersLink, useErrorHandlerLink } from '@neinteractiveliterature/litform';
import { relayStylePagination } from '@apollo/client/utilities';

export function useLarpLibraryApolloLink(
  authenticityToken: string,
  onUnauthenticatedRef?: RefObject<() => void>,
): ApolloLink {
  const authLink = useAuthHeadersLink(authenticityToken);
  const errorHandlerLink = useErrorHandlerLink(onUnauthenticatedRef);

  const link = useMemo(
    () => ApolloLink.from([authLink, errorHandlerLink, new HttpLink({ uri: '/graphql' })]),
    [authLink, errorHandlerLink],
  );

  return link;
}

const typePolicies: TypedTypePolicies = {
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
      tags: relayStylePagination(),
    },
  },
};

function useLarpLibraryApolloClient(
  authenticityToken: string,
  onUnauthenticatedRef: RefObject<() => void>,
): ApolloClient<NormalizedCacheObject> {
  const link = useLarpLibraryApolloLink(authenticityToken, onUnauthenticatedRef);

  const client = useMemo(
    () =>
      new ApolloClient({
        link,
        cache: new InMemoryCache({
          addTypename: true,
          typePolicies,
        }),
      }),
    [link],
  );

  return client;
}

export default useLarpLibraryApolloClient;
