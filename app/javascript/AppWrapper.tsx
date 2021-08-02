import { ApolloProvider } from '@apollo/client';
import { Suspense, useRef } from 'react';
import { Confirm, ErrorBoundary, PageLoadingIndicator } from '@neinteractiveliterature/litform';
import useLarpLibraryApolloClient from './useLarpLibraryApolloClient';
import { BrowserRouter } from 'react-router-dom';

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
            <BrowserRouter>
              <Suspense fallback={<PageLoadingIndicator visible iconSet="bootstrap-icons" />}>
                <WrappedComponent {...(props as unknown as P)} />
              </Suspense>
            </BrowserRouter>
          </ApolloProvider>
        </Confirm>
      </ErrorBoundary>
    );
  };

  Wrapper.displayName = `AppWrapper<${WrappedComponent.displayName ?? 'unknown'}>`;

  return Wrapper;
}

export default AppWrapper;
