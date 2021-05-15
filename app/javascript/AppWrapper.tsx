import { ApolloProvider } from '@apollo/client';
import { Suspense, useRef } from 'react';
import Confirm from './Litform/Confirm';
import ErrorBoundary from './Litform/ErrorBoundary';
import PageLoadingIndicator from './Litform/PageLoadingIndicator';
import useLarpLibraryApolloClient from './useLarpLibraryApolloClient';

function AppWrapper<P>(WrappedComponent: React.ComponentType<P>): React.ComponentType<P> {
  type WrapperProps = P & { graphqlCSRFToken: string };
  const Wrapper = ({ graphqlCSRFToken, ...props }: WrapperProps) => {
    const onUnauthenticated = () => {
      // TODO: handle unauthenticated errors
    };
    const onUnauthenticatedRef = useRef(onUnauthenticated);
    const apolloClient = useLarpLibraryApolloClient(graphqlCSRFToken, onUnauthenticatedRef);

    if (!apolloClient) {
      // we need one render cycle to initialize the client
      return <></>;
    }

    return (
      <ErrorBoundary>
        <Confirm>
          <ApolloProvider client={apolloClient}>
            <Suspense fallback={<PageLoadingIndicator visible />}>
              <WrappedComponent {...(props as unknown as P)} />
            </Suspense>
          </ApolloProvider>
        </Confirm>
      </ErrorBoundary>
    );
  };

  Wrapper.displayName = `AppWrapper<${WrappedComponent.displayName ?? 'unknown'}>`;

  return Wrapper;
}

export default AppWrapper;
