import { ApolloLink, Operation, NextLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RefObject, useEffect, useMemo, useRef } from 'react';

export function useAuthHeadersLink(authenticityToken: string): ApolloLink {
  const authenticityTokenRef = useRef(authenticityToken);
  useEffect(() => {
    authenticityTokenRef.current = authenticityToken;
  }, [authenticityToken]);

  const authHeadersLink = useMemo(
    () =>
      new ApolloLink((operation: Operation, next: NextLink) => {
        operation.setContext((context: ReturnType<Operation['getContext']>) => ({
          ...context,
          credentials: 'same-origin',
          headers: {
            ...context.headers,
            'X-CSRF-Token': authenticityTokenRef.current,
          },
        }));

        return next(operation);
      }),
    [],
  );

  return authHeadersLink;
}

export function useErrorHandlerLink(onUnauthenticatedRef?: RefObject<() => void>): ApolloLink {
  const errorHandlerLink = useMemo(
    () =>
      onError(({ graphQLErrors }) => {
        if (graphQLErrors) {
          if (graphQLErrors.some((err) => (err.extensions || {}).code === 'NOT_AUTHENTICATED')) {
            if (onUnauthenticatedRef?.current) {
              onUnauthenticatedRef.current();
            }
          }
        }
      }),
    [onUnauthenticatedRef],
  );

  return errorHandlerLink;
}
