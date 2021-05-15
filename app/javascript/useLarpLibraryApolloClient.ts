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
  ProjectFile: {
    keyFields: ['id'],
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
